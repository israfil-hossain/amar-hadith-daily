import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar, 
  Heart, 
  Mail, 
  Star, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export const LandingPage = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-islamic-green" />,
      title: "দৈনিক ৩টি হাদিস",
      description: "প্রতিদিন সকালে আপনার ইমেইলে পৌঁছে যাবে ৩টি নির্বাচিত হাদিস"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-islamic-green" />,
      title: "সহীহ হাদিস সংগ্রহ",
      description: "বুখারী, মুসলিম সহ নির্ভরযোগ্য হাদিস গ্রন্থ থেকে সংগৃহীত"
    },
    {
      icon: <Heart className="w-8 h-8 text-islamic-green" />,
      title: "পছন্দের তালিকা",
      description: "গুরুত্বপূর্ণ হাদিসগুলো সংরক্ষণ করুন এবং পরে পড়ুন"
    },
    {
      icon: <Star className="w-8 h-8 text-islamic-green" />,
      title: "অগ্রগতি ট্র্যাকিং",
      description: "আপনার পড়ার অগ্রগতি দেখুন এবং ধারাবাহিকতা বজায় রাখুন"
    }
  ]

  const steps = [
    {
      step: "১",
      title: "নিবন্ধন করুন",
      description: "সহজ নিবন্ধন প্রক্রিয়ার মাধ্যমে যোগ দিন"
    },
    {
      step: "২", 
      title: "দৈনিক হাদিস পান",
      description: "প্রতিদিন ইমেইলে ৩টি হাদিস পাবেন"
    },
    {
      step: "৩",
      title: "পড়ুন ও শিখুন",
      description: "হাদিস পড়ে চিহ্নিত করুন এবং জ্ঞান অর্জন করুন"
    }
  ]

  const stats = [
    { number: "১০,০০০+", label: "হাদিস সংগ্রহ" },
    { number: "৫,০০০+", label: "সক্রিয় ব্যবহারকারী" },
    { number: "৯৮%", label: "সন্তুষ্ট ব্যবহারকারী" },
    { number: "২৪/৭", label: "সেবা প্রদান" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-islamic-green">আমার হাদিস</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-islamic-green hover:text-islamic-green/80">
                  লগইন
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90">
                  নিবন্ধন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          
          <Badge variant="secondary" className="mb-6 bg-islamic-gold/20 text-islamic-green border-islamic-gold/30">
            <Sparkles className="w-3 h-3 mr-1" />
            ইসলামী জ্ঞানের ভান্ডার
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-islamic-green to-primary bg-clip-text text-transparent">
            আমার হাদিস
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            প্রতিদিন ৩টি হাদিস পান আপনার ইমেইলে।<br />
            ইসলামী জ্ঞানে সমৃদ্ধ হোন প্রতিদিন।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90 text-lg px-8 py-3">
                <Mail className="w-5 h-5 mr-2" />
                বিনামূল্যে শুরু করুন
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                লগইন করুন
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-islamic-green mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-islamic-green">
            কেন আমার হাদিস?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ যা আপনার ইসলামী জ্ঞান অর্জনকে সহজ করবে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green/10 to-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg text-islamic-green">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-4">
        <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-islamic-green/5 to-primary/5 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-islamic-green">
              কীভাবে কাজ করে?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              মাত্র ৩টি সহজ ধাপে শুরু করুন আপনার ইসলামী জ্ঞান অর্জনের যাত্রা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-islamic-green">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-islamic-green/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-islamic-green">
            আজই শুরু করুন আপনার ইসলামী জ্ঞান অর্জনের যাত্রা
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            হাজারো মুসলিম ভাই-বোনের সাথে যোগ দিন এবং প্রতিদিন নতুন হাদিস শিখুন
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90 text-lg px-12 py-4">
              <CheckCircle className="w-5 h-5 mr-2" />
              বিনামূল্যে যোগ দিন
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
