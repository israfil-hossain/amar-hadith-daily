'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { DailyHadithSection } from "@/components/DailyHadithSection";
import { PrayerTimes } from "@/components/PrayerTimes";
import { WeeklySummary } from "@/components/WeeklySummary";
import { LandingPage } from "@/components/LandingPage";
import { Leaderboard } from "@/components/Leaderboard";
import { IslamicCalendar } from "@/components/IslamicCalendar";
import { useAuth } from "@/providers/AuthProvider";
import { getDailyHadith, getUserHadithInteractions, markHadithAsRead } from "@/lib/supabase";
import { Hadith } from "@/types/database";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { toast } = useToast();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  console.log("profile: ", profile); 
  console.log("user: ", user); 
  const router = useRouter();
  const [dailyHadith, setDailyHadith] = useState<Hadith[]>([]);
  const [hadithInteractions, setHadithInteractions] = useState<{ hadith_id: string; is_read: boolean; is_favorited: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Use ref to store toast function to avoid dependency issues
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const handleGetStarted = () => {
    router.push('/auth/signup')
  }

  // Load fallback data immediately
  useEffect(() => {
    if (!hasLoaded && dailyHadith.length === 0) {
      // Set fallback data immediately to prevent loading screen
      const fallbackHadith = [
        {
          id: 'fallback-1',
          hadith_number: '১',
          book_id: 'bukhari',
          category_id: 'iman',
          chapter_bangla: 'ইমানের পরিচয়',
          chapter_arabic: 'بدء الوحي',
          text_arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
          text_bangla: 'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল।',
          narrator: 'উমর ইবনুল খাত্তাব (রা.)',
          grade: 'সহীহ',
          reference: 'সহীহ বুখারী',
          explanation: 'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি।',
          difficulty_level: 'beginner' as const,
          status: 'verified' as const,
          view_count: 0,
          like_count: 0,
          share_count: 0,
          is_featured: false,
          is_daily_special: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setDailyHadith(fallbackHadith)
    }
  }, [hasLoaded, dailyHadith.length])

  // Memoize the load function to prevent recreating it
  const loadDailyHadith = useCallback(async () => {
    if (hasLoaded) return;

    setLoading(true)

    try {
      const { data: hadithList, error } = await getDailyHadith();
      if (error) {
        console.error('❌ HomePage: Error loading daily hadith:', error);
        toastRef.current({
          title: "ত্রুটি",
          description: "আজকের হাদিস লোড করতে সমস্যা হয়েছে",
          variant: "destructive",
        });
        return;
      }

      if (hadithList && hadithList.length > 0) {
        setDailyHadith(hadithList);

        // Load user interactions if logged in
        if (user?.id) {
          const hadithIds = hadithList.map(h => h.id);
          const { data: interactions } = await getUserHadithInteractions(user.id, hadithIds);
          setHadithInteractions(interactions || []);

        }
      } else {
        console.warn('⚠️ HomePage: No hadith data received')
      }
    } catch (error) {
      console.error('❌ HomePage: Error loading daily hadith:', error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [user?.id, hasLoaded]);

  useEffect(() => {
    if (!authLoading) {
      loadDailyHadith();
    }
  }, [authLoading, loadDailyHadith]);

  // Debug profile loading
  useEffect(() => {
    if (user && !profile && !authLoading) {
      console.log('User exists but profile is null - this should trigger profile creation')
    }
  }, [user, profile, authLoading])

  const handleAuthAction = () => {
    if (user) {
      signOut();
      toastRef.current({
        title: "সফলভাবে বের হয়েছেন",
        description: "আবার দেখা হবে!",
      });
    } else {
      router.push('/auth/login');
    }
  };

  const handleMarkAsRead = async (hadithId: string) => {
    if (!user) return;

    try {
      const { error } = await markHadithAsRead(user.id, hadithId);

      if (error) {
        toastRef.current({
          title: "ত্রুটি",
          description: "হাদিস চিহ্নিত করতে সমস্যা হয়েছে",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setHadithInteractions(prev => {
        const existing = prev.find(i => i.hadith_id === hadithId);
        if (existing) {
          return prev.map(i =>
            i.hadith_id === hadithId
              ? { ...i, is_read: true }
              : i
          );
        } else {
          return [...prev, {
            hadith_id: hadithId,
            is_read: true,
            is_favorited: false
          }];
        }
      });

      toastRef.current({
        title: "হাদিস পঠিত হিসেবে চিহ্নিত",
        description: "আল্লাহ আপনাকে উত্তম প্রতিদান দিন",
      });
    } catch (error) {
      console.error('Error marking hadith as read:', error);
      toastRef.current({
        title: "ত্রুটি",
        description: "আবার চেষ্টা করুন",
        variant: "destructive",
      });
    }
  };

  // Merge hadith with user interactions
  const dailyHadithWithInteractions = dailyHadith.map(hadith => {
    const interaction = hadithInteractions.find(i => i.hadith_id === hadith.id);
    return {
      ...hadith,
      isRead: interaction?.is_read || false,
      isFavorited: interaction?.is_favorited || false,
    };
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
          <p className="text-muted-foreground">অ্যাকাউন্ট যাচাই করা হচ্ছে...</p>
          <p className="text-xs text-muted-foreground mt-2">যদি এটি দীর্ঘ সময় নেয়, পেজ রিফ্রেশ করুন</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <Header
        user={profile ? {
          name: profile.full_name || 'ব্যবহারকারী',
          email: profile.email,
          id: profile.id
        } : null}
        onAuthAction={handleAuthAction}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <DailyHadithSection
              dailyHadith={dailyHadithWithInteractions}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <IslamicCalendar compact />
            <PrayerTimes compact />
            <Leaderboard compact limit={5} />
            <WeeklySummary compact />
          </div>
        </div>
      </main>
    </div>
  );
}
