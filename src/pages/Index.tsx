import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { DailyHadithSection } from "@/components/DailyHadithSection";
import { mockHadithData, Hadith } from "@/data/mockHadith";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hadithData, setHadithData] = useLocalStorage<Hadith[]>("hadithData", mockHadithData);

  // Get today's 3 hadith (first 3 for demo)
  const dailyHadith = hadithData.slice(0, 3);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app this would connect to Supabase
    const mockUser = {
      name: email.split('@')[0],
      email: email
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    toast({
      title: "সফলভাবে প্রবেশ করেছেন",
      description: "আপনার দৈনিক হাদিস অধ্যয়ন শুরু করুন",
    });
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // Mock signup - in real app this would connect to Supabase
    const newUser = { name, email };
    setUser(newUser);
    setIsAuthModalOpen(false);
    toast({
      title: "স্বাগতম!",
      description: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
    });
  };

  const handleAuthAction = () => {
    if (user) {
      setUser(null);
      toast({
        title: "সফলভাবে বের হয়েছেন",
        description: "আবার দেখা হবে!",
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleMarkAsRead = (hadithId: string) => {
    setHadithData(prev => 
      prev.map(hadith => 
        hadith.id === hadithId 
          ? { ...hadith, isRead: true }
          : hadith
      )
    );
    toast({
      title: "হাদিস পঠিত হিসেবে চিহ্নিত",
      description: "আল্লাহ আপনাকে উত্তম প্রতিদান দিন",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <Header user={user} onAuthAction={handleAuthAction} />
      
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <DailyHadithSection 
            dailyHadith={dailyHadith}
            onMarkAsRead={handleMarkAsRead}
          />
        ) : (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-islamic-green to-primary bg-clip-text text-transparent">
              আমার হাদিস
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              প্রতিদিন ৩টি হাদিস পান আপনার ইমেইলে। পড়ার পর এখানে এসে চিহ্নিত করুন।<br />
              ইসলামী জ্ঞানে সমৃদ্ধ হোন প্রতিদিন।
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-card hover:shadow-lg"
            >
              শুরু করুন
            </button>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
};

export default Index;
