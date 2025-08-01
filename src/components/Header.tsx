import { Book, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onAuthAction: () => void;
}

export const Header = ({ user, onAuthAction }: HeaderProps) => {
  return (
    <header className="w-full bg-gradient-to-r from-islamic-green to-primary shadow-card border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-islamic-gold/20 flex items-center justify-center">
              <Book className="w-6 h-6 text-islamic-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">আমার হাদিস</h1>
              <p className="text-sm text-primary-foreground/80">দৈনিক হাদিস অধ্যয়ন</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-primary-foreground">{user.name}</p>
                  <p className="text-xs text-primary-foreground/70">{user.email}</p>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-islamic-gold text-primary text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAuthAction}
                  className="text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuthAction}
                className="bg-islamic-gold hover:bg-islamic-gold/90 text-primary transition-all duration-300"
              >
                <User className="w-4 h-4 mr-2" />
                সাইন ইন
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};