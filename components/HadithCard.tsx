import { useState } from "react";
import { Check, BookOpen, Calendar, Heart, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hadith } from "@/types/database";
import { HadithRating } from "./HadithRating";
import { SocialShare } from "./SocialShare";
import { CommentsSection } from "./CommentsSection";

interface HadithCardProps {
  hadith: Hadith & { isRead?: boolean; isFavorited?: boolean };
  onMarkAsRead: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  showMarkAsRead?: boolean;
  showRating?: boolean;
}

export const HadithCard = ({
  hadith,
  onMarkAsRead,
  onToggleFavorite,
  showMarkAsRead = true,
  showRating = false
}: HadithCardProps) => {
  const [showComments, setShowComments] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`w-full max-w-4xl mx-auto transition-all duration-300 hover:shadow-lg ${
      hadith.isRead ? 'bg-sage-green/20 border-sage-green/30' : 'bg-card hover:shadow-card'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <Badge variant="secondary" className="text-xs font-medium">
                {hadith.book?.name_bangla || hadith.source} • {hadith.hadith_number || hadith.hadithNumber}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{hadith.chapter_bangla || hadith.chapter}</p>
            </div>
          </div>
          
          {hadith.isRead && (
            <div className="flex items-center gap-2 text-islamic-green">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">পঠিত</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Arabic Text */}
        <div className="text-center py-6 px-4 bg-warm-cream rounded-lg border border-border/20">
          <p className="text-lg leading-relaxed font-arabic text-primary" style={{ fontFamily: 'serif', direction: 'rtl' }}>
            {hadith.text_arabic || hadith.arabic}
          </p>
        </div>

        {/* Bengali Translation */}
        <div className="bg-gradient-to-br from-background to-muted/30 p-6 rounded-lg border border-border/20">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-islamic-green" />
            <span className="text-sm font-medium text-islamic-green">বাংলা অনুবাদ</span>
          </div>
          <p className="text-lg leading-relaxed text-foreground font-medium">
            {hadith.text_bangla || hadith.bangla}
          </p>
        </div>

        {/* English Translation (if available) */}
        {hadith.text_english && (
          <div className="bg-gradient-to-br from-background to-muted/30 p-6 rounded-lg border border-border/20">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-islamic-green" />
              <span className="text-sm font-medium text-islamic-green">English Translation</span>
            </div>
            <p className="text-lg leading-relaxed text-foreground font-medium">
              {hadith.text_english}
            </p>
          </div>
        )}

        {/* Additional Info */}
        {(hadith.narrator || hadith.grade || hadith.reference) && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {hadith.narrator && (
                <div>
                  <span className="font-medium text-muted-foreground">বর্ণনাকারী:</span>
                  <p className="mt-1">{hadith.narrator}</p>
                </div>
              )}
              {hadith.grade && (
                <div>
                  <span className="font-medium text-muted-foreground">হাদিসের মান:</span>
                  <p className="mt-1">{hadith.grade}</p>
                </div>
              )}
              {hadith.reference && (
                <div>
                  <span className="font-medium text-muted-foreground">রেফারেন্স:</span>
                  <p className="mt-1">{hadith.reference}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center pt-4">
          {showMarkAsRead && !hadith.isRead && (
            <Button
              onClick={() => onMarkAsRead(hadith.id)}
              className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90 text-primary-foreground px-6 py-2 transition-all duration-300"
            >
              <Check className="w-4 h-4 mr-2" />
              পঠিত হিসেবে চিহ্নিত করুন
            </Button>
          )}

          {onToggleFavorite && (
            <Button
              variant="outline"
              onClick={() => onToggleFavorite(hadith.id)}
              className={`px-4 py-2 ${hadith.isFavorited ? 'text-red-600 border-red-600' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${hadith.isFavorited ? 'fill-current' : ''}`} />
              {hadith.isFavorited ? 'পছন্দের তালিকায় আছে' : 'পছন্দের তালিকায় যোগ করুন'}
            </Button>
          )}

          <SocialShare hadith={hadith} compact />

          <Button
            variant="outline"
            onClick={() => setShowComments(!showComments)}
            className="px-4 py-2"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            মন্তব্য
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <CommentsSection hadithId={hadith.id} compact />
          </div>
        )}

        {/* Rating Component */}
        {showRating && <HadithRating hadithId={hadith.id} />}


      </CardContent>
    </Card>
  );
};