import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Copy,
  Mail,
  Download
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Hadith } from '@/types/database'

interface SocialShareProps {
  hadith: Hadith
  compact?: boolean
}

export const SocialShare = ({ hadith, compact = false }: SocialShareProps) => {
  const { toast } = useToast()
  const [sharing, setSharing] = useState(false)

  const shareText = `${hadith.text_bangla || hadith.bangla}

বর্ণনাকারী: ${hadith.narrator}
সূত্র: ${hadith.reference}

#হাদিস #ইসলাম #আমারহাদিস`

  const shareUrl = `${window.location.origin}/hadith/${hadith.id}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
      toast({
        title: 'কপি হয়েছে',
        description: 'হাদিসটি ক্লিপবোর্ডে কপি হয়েছে',
      })
    } catch (error) {
      toast({
        title: 'ত্রুটি',
        description: 'কপি করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    }
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    window.open(url, '_blank')
  }

  const shareViaEmail = () => {
    const subject = `হাদিস শেয়ার - ${hadith.hadith_number || ''}`
    const body = `${shareText}\n\nআরও হাদিস পড়ুন: ${shareUrl}`
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url)
  }

  const downloadAsImage = async () => {
    try {
      setSharing(true)
      
      // Create a canvas to generate image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 800
      canvas.height = 600

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#10B981')
      gradient.addColorStop(1, '#3B82F6')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add text
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      
      // Title
      ctx.fillText('আমার হাদিস', canvas.width / 2, 60)
      
      // Arabic text (if available)
      if (hadith.text_arabic || hadith.arabic) {
        ctx.font = '20px Arial'
        ctx.direction = 'rtl'
        ctx.fillText(hadith.text_arabic || hadith.arabic || '', canvas.width / 2, 150)
      }
      
      // Bengali text
      ctx.font = '18px Arial'
      ctx.direction = 'ltr'
      const bengaliText = hadith.text_bangla || hadith.bangla || ''
      const words = bengaliText.split(' ')
      let line = ''
      let y = 220
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > canvas.width - 100 && n > 0) {
          ctx.fillText(line, canvas.width / 2, y)
          line = words[n] + ' '
          y += 30
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, canvas.width / 2, y)
      
      // Source
      ctx.font = '14px Arial'
      ctx.fillText(`বর্ণনাকারী: ${hadith.narrator}`, canvas.width / 2, y + 60)
      ctx.fillText(`সূত্র: ${hadith.reference}`, canvas.width / 2, y + 85)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `hadith-${hadith.hadith_number || 'share'}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          toast({
            title: 'ডাউনলোড সম্পূর্ণ',
            description: 'হাদিসের ছবি ডাউনলোড হয়েছে',
          })
        }
      }, 'image/png')
    } catch (error) {
      toast({
        title: 'ত্রুটি',
        description: 'ছবি তৈরি করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    } finally {
      setSharing(false)
    }
  }

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            কপি করুন
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnFacebook}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnTwitter}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareViaEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsImage} disabled={sharing}>
            <Download className="w-4 h-4 mr-2" />
            {sharing ? 'তৈরি হচ্ছে...' : 'ছবি ডাউনলোড'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="w-4 h-4 mr-2" />
        কপি
      </Button>
      
      <Button variant="outline" size="sm" onClick={shareOnWhatsApp}>
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button variant="outline" size="sm" onClick={shareOnFacebook}>
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      
      <Button variant="outline" size="sm" onClick={shareOnTwitter}>
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      
      <Button variant="outline" size="sm" onClick={shareViaEmail}>
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={downloadAsImage}
        disabled={sharing}
      >
        <Download className="w-4 h-4 mr-2" />
        {sharing ? 'তৈরি হচ্ছে...' : 'ছবি'}
      </Button>
    </div>
  )
}
