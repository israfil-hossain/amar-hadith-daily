import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Reply, 
  MoreVertical,
  Flag,
  Trash2,
  Edit3
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  hadith_id: string
  parent_id?: string
  is_approved: boolean
  like_count: number
  user: {
    id: string
    full_name: string
    email: string
  }
  replies?: Comment[]
  isLiked?: boolean
}

interface CommentsSectionProps {
  hadithId: string
  compact?: boolean
}

export const CommentsSection = ({ hadithId, compact = false }: CommentsSectionProps) => {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    loadComments()
  }, [hadithId])

  const loadComments = async () => {
    try {
      setLoading(true)

      const { data: commentsData, error } = await supabase
        .from('hadith_comments')
        .select(`
          *,
          user:profiles(id, full_name, email),
          replies:hadith_comments!parent_id(
            *,
            user:profiles(id, full_name, email)
          )
        `)
        .eq('hadith_id', hadithId)
        .is('parent_id', null)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading comments:', error)
        return
      }

      // Load user likes if authenticated
      if (user && commentsData) {
        const commentIds = commentsData.flatMap(c => [
          c.id,
          ...(c.replies || []).map((r: any) => r.id)
        ])

        const { data: likesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds)

        const likedCommentIds = new Set(likesData?.map(l => l.comment_id) || [])

        const commentsWithLikes = commentsData.map(comment => ({
          ...comment,
          isLiked: likedCommentIds.has(comment.id),
          replies: comment.replies?.map((reply: any) => ({
            ...reply,
            isLiked: likedCommentIds.has(reply.id)
          }))
        }))

        setComments(commentsWithLikes)
      } else {
        setComments(commentsData || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return

    try {
      setSubmitting(true)

      const { data, error } = await supabase
        .from('hadith_comments')
        .insert({
          content: content.trim(),
          hadith_id: hadithId,
          user_id: user.id,
          parent_id: parentId || null,
          is_approved: true // Auto-approve for now, can add moderation later
        })
        .select(`
          *,
          user:profiles(id, full_name, email)
        `)
        .single()

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'মন্তব্য পোস্ট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Add to local state
      if (parentId) {
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...(comment.replies || []), data] }
            : comment
        ))
        setReplyContent('')
        setReplyingTo(null)
      } else {
        setComments(prev => [data, ...prev])
        setNewComment('')
      }

      toast({
        title: 'সফল',
        description: 'আপনার মন্তব্য পোস্ট হয়েছে',
      })
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast({
        title: 'ত্রুটি',
        description: 'মন্তব্য পোস্ট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLike = async (commentId: string) => {
    if (!user) return

    try {
      const comment = comments.find(c => c.id === commentId) || 
                    comments.flatMap(c => c.replies || []).find(r => r.id === commentId)
      
      if (!comment) return

      if (comment.isLiked) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)

        await supabase
          .from('hadith_comments')
          .update({ like_count: Math.max(0, comment.like_count - 1) })
          .eq('id', commentId)
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id })

        await supabase
          .from('hadith_comments')
          .update({ like_count: comment.like_count + 1 })
          .eq('id', commentId)
      }

      // Update local state
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            like_count: comment.isLiked ? comment.like_count - 1 : comment.like_count + 1
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    like_count: reply.isLiked ? reply.like_count - 1 : reply.like_count + 1
                  }
                : reply
            )
          }
        }
        return comment
      }))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true
      })
    } catch {
      return 'কিছুক্ষণ আগে'
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-gradient-to-br from-islamic-green to-primary text-primary-foreground text-xs">
            {comment.user?.full_name?.charAt(0) || comment.user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user?.full_name || 'ব্যবহারকারী'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.created_at)}
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-2">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={() => toggleLike(comment.id)}
              disabled={!user}
            >
              <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {comment.like_count || 0}
            </Button>

            {!isReply && user && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="w-3 h-3 mr-1" />
                উত্তর
              </Button>
            )}

            {user && (user.id === comment.user_id || profile?.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit3 className="w-3 h-3 mr-2" />
                    সম্পাদনা
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-3 h-3 mr-2" />
                    মুছে ফেলুন
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="আপনার উত্তর লিখুন..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => submitComment(replyContent, comment.id)}
                  disabled={!replyContent.trim() || submitting}
                >
                  <Send className="w-3 h-3 mr-1" />
                  উত্তর দিন
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent('')
                  }}
                >
                  বাতিল
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card className={compact ? '' : 'shadow-lg'}>
      <CardHeader className={compact ? 'pb-3' : ''}>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-islamic-green" />
          মন্তব্য ({comments.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Comment Form */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="আপনার মন্তব্য লিখুন..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => submitComment(newComment)}
              disabled={!newComment.trim() || submitting}
              className="bg-islamic-green hover:bg-islamic-green/90"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'পোস্ট হচ্ছে...' : 'মন্তব্য করুন'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>মন্তব্য করতে লগইন করুন</p>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-full h-12 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>এখনো কোনো মন্তব্য নেই</p>
            <p className="text-sm">প্রথম মন্তব্য করুন!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
