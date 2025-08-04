import {
  Book,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  BookOpen,
  Search,
  Trophy,
  Calendar,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  user: { name: string; email: string; id: string } | null;
  onAuthAction: () => void;
}

export const Header = ({ user, onAuthAction }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log("user==> ", user); 
  const navigationItems = [
    { href: "/hadith", label: "সব হাদিস", icon: BookOpen },
    { href: "/categories", label: "বিষয়সমূহ", icon: Book },
    { href: "/search", label: "অনুসন্ধান", icon: Search },
    { href: "/favorites", label: "পছন্দের", icon: Heart },
    { href: "/contribute", label: "অবদান রাখুন", icon: Plus },
    { href: "/achievements", label: "অর্জনসমূহ", icon: Trophy },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-islamic-green to-primary shadow-card border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-islamic-gold/20 flex items-center justify-center">
              <Logo size="md" variant="green" className="text-islamic-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">
                আমার হাদিস
              </h1>
              <p className="text-sm text-primary-foreground/80">
                দৈনিক হাদিস অধ্যয়ন
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-1 ">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-primary-foreground hover:bg-white/10"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-primary-foreground">
                      {user.name || "ব্যবহারকারী"}
                    </p>
                    <p className="text-xs text-primary-foreground/70">
                      {user.email || "user@example.com"}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarFallback className="bg-islamic-gold text-primary text-sm font-semibold">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          প্রোফাইল
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/achievements"
                          className="flex items-center"
                        >
                          <Trophy className="w-4 h-4 mr-2" />
                          অর্জনসমূহ
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/contribute" className="flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          অবদান রাখুন
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          পছন্দের তালিকা
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1">
                        <LanguageSwitcher compact />
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          সেটিংস
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onAuthAction}
                        className="text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        লগ আউট
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
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

        {/* Mobile Navigation */}
        {user && mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-primary-foreground hover:bg-white/10 transition-colors"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  প্রোফাইল
                </Button>
              </Link>
              <Link href="/progress" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  অগ্রগতি
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
