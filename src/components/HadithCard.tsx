import { useState } from "react";
import { Check, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hadith } from "@/data/mockHadith";

interface HadithCardProps {
  hadith: Hadith;
  onMarkAsRead: (id: string) => void;
  showMarkAsRead?: boolean;
}

export const HadithCard = ({ hadith, onMarkAsRead, showMarkAsRead = true }: HadithCardProps) => {
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
                {hadith.source} • {hadith.hadithNumber}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{hadith.chapter}</p>
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
            {hadith.arabic}
          </p>
        </div>

        {/* Bengali Translation */}
        <div className="bg-gradient-to-br from-background to-muted/30 p-6 rounded-lg border border-border/20">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-islamic-green" />
            <span className="text-sm font-medium text-islamic-green">বাংলা অনুবাদ</span>
          </div>
          <p className="text-lg leading-relaxed text-foreground font-medium">
            {hadith.bangla}
          </p>
        </div>

        {/* Action Button */}
        {showMarkAsRead && !hadith.isRead && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onMarkAsRead(hadith.id)}
              className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90 text-primary-foreground px-8 py-2 transition-all duration-300"
            >
              <Check className="w-4 h-4 mr-2" />
              পঠিত হিসেবে চিহ্নিত করুন
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};