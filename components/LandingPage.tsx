'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Users,
  Trophy,
  Star,
  Calendar,
  Clock,
  Heart,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Sparkles
} from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const features = [
    {
      icon: BookOpen,
      title: 'দৈনিক হাদিস',
      description: 'প্রতিদিন ৩টি নির্বাচিত হাদিস পড়ুন এবং জ্ঞান অর্জন করুন',
      color: 'bg-blue-500'
    },
    {
      icon: Trophy,
      title: 'অগ্রগতি ট্র্যাকিং',
      description: 'আপনার পড়ার অগ্রগতি দেখুন এবং লক্ষ্য অর্জন করুন',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'কমিউনিটি',
      description: 'অন্যান্য মুসলিম ভাইবোনদের সাথে যুক্ত হন',
      color: 'bg-purple-500'
    },
    {
      icon: Calendar,
      title: 'ইসলামিক ক্যালেন্ডার',
      description: 'হিজরি তারিখ এবং গুরুত্বপূর্ণ দিনগুলো জানুন',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'হাদিস সংগ্রহ' },
    { number: '5,000+', label: 'সক্রিয় ব্যবহারকারী' },
    { number: '50+', label: 'হাদিসের বই' },
    { number: '99%', label: 'সন্তুষ্ট ব্যবহারকারী' }
  ]

  const testimonials = [
    {
      name: 'আহমেদ হাসান',
      role: 'ইসলামিক স্কলার',
      content: 'এই অ্যাপটি আমার দৈনন্দিন ইসলামিক শিক্ষার জন্য অপরিহার্য হয়ে উঠেছে।',
      rating: 5
    },
    {
      name: 'ফাতিমা খাতুন',
      role: 'শিক্ষার্থী',
      content: 'খুবই সহজ এবং সুন্দর ইন্টারফেস। প্রতিদিন নতুন কিছু শিখতে পারি।',
      rating: 5
    },
    {
      name: 'মোহাম্মদ রহিম',
      role: 'ইমাম',
      content: 'হাদিসের বিশুদ্ধতা এবং অনুবাদের মান অসাধারণ।',
      rating: 5
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
      description: "প্রতিদিন ৩টি নির্বাচিত হাদিস পড়ুন"
    },
    {
      step: "৩",
      title: "পড়ুন ও শিখুন",
      description: "হাদিস পড়ে চিহ্নিত করুন এবং জ্ঞান অর্জন করুন"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      {/* Navigation Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-islamic-green to-islamic-gold flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-islamic-green">আমার হাদিস</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-islamic-green hover:text-islamic-green/80">
                  লগইন
                </Button>
              </Link>
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-islamic-green to-islamic-gold hover:from-islamic-green/90 hover:to-islamic-gold/90"
              >
                নিবন্ধন
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-islamic-green/10 to-islamic-gold/10" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-islamic-green text-white">
              ✨ নতুন ফিচার: AI-powered হাদিস সুপারিশ
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              আমার হাদিস
              <span className="block text-islamic-green">দৈনিক ইসলামিক শিক্ষা</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              প্রতিদিন সহীহ হাদিস পড়ুন, আপনার ইসলামিক জ্ঞান বৃদ্ধি করুন এবং
              একটি সুন্দর কমিউনিটির অংশ হন। সম্পূর্ণ বিনামূল্যে।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-islamic-green hover:bg-islamic-green/90 text-white px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                শুরু করুন
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                ডেমো দেখুন
              </Button>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-islamic-green/20">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-islamic-green/10 rounded-lg flex items-center justify-center mb-2">
                        <BookOpen className="w-6 h-6 text-islamic-green" />
                      </div>
                      <CardTitle className="text-lg">আজকের হাদিস</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        "যে ব্যক্তি জ্ঞান অন্বেষণে বের হয়..."
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-islamic-gold/20">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-islamic-gold/10 rounded-lg flex items-center justify-center mb-2">
                        <Trophy className="w-6 h-6 text-islamic-gold" />
                      </div>
                      <CardTitle className="text-lg">অগ্রগতি</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-islamic-gold h-2 rounded-full w-3/4" />
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/20">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-purple-500" />
                      </div>
                      <CardTitle className="text-lg">কমিউনিটি</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        ৫,০০০+ সক্রিয় সদস্য
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-islamic-green mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ব্যবহারকারীরা কি বলছেন?
            </h2>
            <p className="text-xl text-muted-foreground">
              হাজারো সন্তুষ্ট ব্যবহারকারীর মতামত
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-islamic-gold text-islamic-gold" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-islamic-green to-islamic-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            আজই শুরু করুন আপনার ইসলামিক যাত্রা
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            লক্ষ লক্ষ মুসলিম ভাইবোনের সাথে যুক্ত হন এবং প্রতিদিন নতুন কিছু শিখুন
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-islamic-green hover:bg-white/90 px-8 py-3 text-lg font-semibold"
            >
              বিনামূল্যে শুরু করুন
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-5 h-5" />
                <span>বিনামূল্যে</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-5 h-5" />
                <span>নিরাপদ</span>
              </div>
              <div className="flex items-center gap-1">
                <Smartphone className="w-5 h-5" />
                <span>মোবাইল ফ্রেন্ডলি</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">আমার হাদিস</h3>
              <p className="text-muted-foreground mb-4">
                দৈনিক ইসলামিক শিক্ষার জন্য আপনার বিশ্বস্ত সঙ্গী
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">ফিচারসমূহ</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">দৈনিক হাদিস</Link></li>
                <li><Link href="#" className="hover:text-foreground">অগ্রগতি ট্র্যাকিং</Link></li>
                <li><Link href="#" className="hover:text-foreground">কমিউনিটি</Link></li>
                <li><Link href="#" className="hover:text-foreground">ইসলামিক ক্যালেন্ডার</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">সাপোর্ট</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">সাহায্য কেন্দ্র</Link></li>
                <li><Link href="#" className="hover:text-foreground">যোগাযোগ</Link></li>
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="hover:text-foreground">ফিডব্যাক</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">আইনি</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">গোপনীয়তা নীতি</Link></li>
                <li><Link href="#" className="hover:text-foreground">ব্যবহারের শর্তাবলী</Link></li>
                <li><Link href="#" className="hover:text-foreground">কুকি নীতি</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; ২০২৪ আমার হাদিস। সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
