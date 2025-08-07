'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, User, Bell, Shield, Globe, LogOut, Trash2 } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: ''
  })
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    prayer_reminders: true
  })
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_public: true,
    progress_public: false
  })
  
  // App Settings
  const [appSettings, setAppSettings] = useState({
    preferred_language: 'bn',
    theme: 'light'
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/settings')
      return
    }

    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      })
      
      setNotificationSettings(profile.notification_settings || {
        email: true,
        push: true,
        prayer_reminders: true
      })
      
      setPrivacySettings(profile.privacy_settings || {
        profile_public: true,
        progress_public: false
      })
      
      setAppSettings({
        preferred_language: profile.preferred_language || 'bn',
        theme: 'light'
      })
    }
  }, [user, profile, router])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile(profileData)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'প্রোফাইল আপডেট করা হয়েছে',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile({
        notification_settings: notificationSettings
      })
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'নোটিফিকেশন সেটিংস আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'নোটিফিকেশন সেটিংস আপডেট করা হয়েছে',
      })
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile({
        privacy_settings: privacySettings
      })
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'প্রাইভেসি সেটিংস আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'প্রাইভেসি সেটিংস আপডেট করা হয়েছে',
      })
    } catch (error) {
      console.error('Error updating privacy:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAppSettings = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile({
        preferred_language: appSettings.preferred_language
      })
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'অ্যাপ সেটিংস আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'অ্যাপ সেটিংস আপডেট করা হয়েছে',
      })
    } catch (error) {
      console.error('Error updating app settings:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: 'সফল',
        description: 'আপনি সফলভাবে লগ আউট হয়েছেন',
      })
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'ত্রুটি',
        description: 'লগ আউট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    }
  }

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/auth/login?redirectTo=/settings')
    }
    return null
  }

  // Show loading if profile is still loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'প্রোফাইল', icon: User },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'privacy', label: 'প্রাইভেসি', icon: Shield },
    { id: 'app', label: 'অ্যাপ সেটিংস', icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">সেটিংস</h1>
            <p className="text-muted-foreground">আপনার অ্যাকাউন্ট এবং অ্যাপ সেটিংস পরিচালনা করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {tab.label}
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>প্রোফাইল তথ্য</CardTitle>
                    <CardDescription>আপনার ব্যক্তিগত তথ্য আপডেট করুন</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">পূর্ণ নাম</Label>
                        <Input
                          id="full_name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="আপনার পূর্ণ নাম"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">ব্যবহারকারীর নাম</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="ব্যবহারকারীর নাম"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">ইমেইল</Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">পরিচয়</Label>
                      <Input
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="আপনার সম্পর্কে কিছু বলুন"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">অবস্থান</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="আপনার অবস্থান"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">ওয়েবসাইট</Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="আপনার ওয়েবসাইট"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          সংরক্ষণ করুন
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>নোটিফিকেশন সেটিংস</CardTitle>
                    <CardDescription>আপনি কোন নোটিফিকেশন পেতে চান তা নির্বাচন করুন</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>ইমেইল নোটিফিকেশন</Label>
                        <p className="text-sm text-muted-foreground">নতুন হাদিস এবং আপডেটের জন্য ইমেইল পান</p>
                      </div>
                      <Switch
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, email: checked }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>পুশ নোটিফিকেশন</Label>
                        <p className="text-sm text-muted-foreground">ব্রাউজার পুশ নোটিফিকেশন পান</p>
                      </div>
                      <Switch
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>নামাজের রিমাইন্ডার</Label>
                        <p className="text-sm text-muted-foreground">নামাজের সময় রিমাইন্ডার পান</p>
                      </div>
                      <Switch
                        checked={notificationSettings.prayer_reminders}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, prayer_reminders: checked }))
                        }
                      />
                    </div>
                    
                    <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          সংরক্ষণ করুন
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle>প্রাইভেসি সেটিংস</CardTitle>
                    <CardDescription>আপনার তথ্যের গোপনীয়তা নিয়ন্ত্রণ করুন</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>পাবলিক প্রোফাইল</Label>
                        <p className="text-sm text-muted-foreground">অন্যরা আপনার প্রোফাইল দেখতে পারবে</p>
                      </div>
                      <Switch
                        checked={privacySettings.profile_public}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, profile_public: checked }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>পাবলিক অগ্রগতি</Label>
                        <p className="text-sm text-muted-foreground">অন্যরা আপনার পড়ার অগ্রগতি দেখতে পারবে</p>
                      </div>
                      <Switch
                        checked={privacySettings.progress_public}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, progress_public: checked }))
                        }
                      />
                    </div>
                    
                    <Button onClick={handleSavePrivacy} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          সংরক্ষণ করুন
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'app' && (
                <Card>
                  <CardHeader>
                    <CardTitle>অ্যাপ সেটিংস</CardTitle>
                    <CardDescription>অ্যাপের সাধারণ সেটিংস পরিবর্তন করুন</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>ভাষা</Label>
                      <Select
                        value={appSettings.preferred_language}
                        onValueChange={(value) => 
                          setAppSettings(prev => ({ ...prev, preferred_language: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bn">বাংলা</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleSaveAppSettings} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          সংরক্ষণ করুন
                        </>
                      )}
                    </Button>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">অ্যাকাউন্ট অ্যাকশন</h3>
                      
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        লগ আউট
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="w-4 h-4 mr-2" />
                            অ্যাকাউন্ট ডিলিট করুন
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                            <AlertDialogDescription>
                              এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না। এটি আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা স্থায়ীভাবে মুছে দেবে।
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground">
                              হ্যাঁ, ডিলিট করুন
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
