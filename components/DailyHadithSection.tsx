import { Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HadithCard } from "./HadithCard";
import { Hadith } from "@/types/database";
import { Logo } from "@/components/ui/logo";

interface DailyHadithSectionProps {
  dailyHadith: (Hadith & { isRead?: boolean; isFavorited?: boolean })[];
  onMarkAsRead: (id: string) => void;
}

export const DailyHadithSection = ({ dailyHadith, onMarkAsRead }: DailyHadithSectionProps) => {
  console.log('📖 DailyHadithSection: Received hadith data:', dailyHadith.length, 'items')
  console.log('📖 DailyHadithSection: Hadith data:', dailyHadith)

  const today = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const readCount = dailyHadith.filter(h => h.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-islamic-green/10 to-primary/10 border border-islamic-green/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                <Logo size="md" variant="white" />
              </div>
              <div>
                <CardTitle className="text-xl text-islamic-green">আজকের হাদিস</CardTitle>
                <p className="text-sm text-muted-foreground">{today}</p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="bg-islamic-gold/20 text-islamic-green border-islamic-gold/30">
                <Star className="w-3 h-3 mr-1" />
                {readCount}/৩ পঠিত
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>দৈনিক ৩টি হাদিস • ইমেইলে প্রেরিত</span>
          </div>
        </CardContent>
      </Card>

      {/* Hadith Cards */}
      <div className="space-y-6">
        {dailyHadith.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">আজকের হাদিস লোড হচ্ছে...</h3>
              <p className="text-sm">অনুগ্রহ করে একটু অপেক্ষা করুন</p>
            </div>
          </Card>
        ) : (
          dailyHadith.map((hadith, index) => (
            <div key={hadith.id} className="relative">
              <div className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              <div className="ml-8">
                <HadithCard
                  hadith={hadith}
                  onMarkAsRead={onMarkAsRead}
                  showMarkAsRead={true}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};