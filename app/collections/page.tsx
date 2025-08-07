'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, BookOpen, ArrowLeft, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { UserCollection } from '@/types/database'

export default function CollectionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [collections, setCollections] = useState<UserCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCollection, setEditingCollection] = useState<UserCollection | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/collections')
      return
    }

    loadCollections()
  }, [user, router])

  const loadCollections = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'সংগ্রহ লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      setCollections(data || [])
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    if (!user) return

    if (!formData.name.trim()) {
      toast({
        title: 'নাম প্রয়োজন',
        description: 'সংগ্রহের নাম দিন',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_collections')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          hadith_ids: []
        })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'সংগ্রহ তৈরি করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'নতুন সংগ্রহ তৈরি করা হয়েছে',
      })

      setFormData({ name: '', description: '', is_public: false })
      setShowCreateForm(false)
      loadCollections()
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  const handleUpdateCollection = async () => {
    if (!user || !editingCollection) return

    if (!formData.name.trim()) {
      toast({
        title: 'নাম প্রয়োজন',
        description: 'সংগ্রহের নাম দিন',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_collections')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCollection.id)

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'সংগ্রহ আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'সংগ্রহ আপডেট করা হয়েছে',
      })

      setFormData({ name: '', description: '', is_public: false })
      setEditingCollection(null)
      loadCollections()
    } catch (error) {
      console.error('Error updating collection:', error)
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    if (!user) return

    if (!confirm('আপনি কি নিশ্চিত যে এই সংগ্রহটি মুছে ফেলতে চান?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', user.id)

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'সংগ্রহ মুছতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'সংগ্রহ মুছে ফেলা হয়েছে',
      })

      loadCollections()
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  const startEditing = (collection: UserCollection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      is_public: collection.is_public
    })
    setShowCreateForm(false)
  }

  const cancelEditing = () => {
    setEditingCollection(null)
    setFormData({ name: '', description: '', is_public: false })
  }

  const startCreating = () => {
    setShowCreateForm(true)
    setEditingCollection(null)
    setFormData({ name: '', description: '', is_public: false })
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            প্রোফাইলে ফিরে যান
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-islamic-green">
                      আমার সংগ্রহ
                    </CardTitle>
                    <CardDescription className="text-lg">
                      আপনার ব্যক্তিগত হাদিস সংগ্রহ ({collections.length}টি)
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={startCreating}
                  className="bg-gradient-to-r from-islamic-green to-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন সংগ্রহ
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Create/Edit Form */}
          {(showCreateForm || editingCollection) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingCollection ? 'সংগ্রহ সম্পাদনা' : 'নতুন সংগ্রহ তৈরি করুন'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">সংগ্রহের নাম *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="যেমন: প্রিয় দোয়ার হাদিস"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="এই সংগ্রহ সম্পর্কে কিছু লিখুন..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                  />
                  <Label htmlFor="is_public">সবার জন্য দৃশ্যমান করুন</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
                    className="bg-gradient-to-r from-islamic-green to-primary"
                  >
                    {editingCollection ? 'আপডেট করুন' : 'তৈরি করুন'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false)
                      cancelEditing()
                    }}
                  >
                    বাতিল
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collections Grid */}
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-islamic-green transition-colors">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {collection.is_public ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">
                        {collection.hadith_ids.length} টি হাদিস
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(collection.created_at).toLocaleDateString('bn-BD')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/collections/${collection.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          দেখুন
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(collection)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCollection(collection.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">কোনো সংগ্রহ নেই</h3>
                <p className="text-muted-foreground mb-6">
                  আপনি এখনো কোনো হাদিস সংগ্রহ তৈরি করেননি।<br />
                  আপনার পছন্দের হাদিসগুলি সংগঠিত করতে একটি সংগ্রহ তৈরি করুন।
                </p>
                <Button
                  onClick={startCreating}
                  className="bg-gradient-to-r from-islamic-green to-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  প্রথম সংগ্রহ তৈরি করুন
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
