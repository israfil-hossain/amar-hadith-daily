import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'আমার হাদিস - দৈনিক হাদিস অধ্যয়ন',
  description: 'প্রতিদিন ৩টি হাদিস পান আপনার ইমেইলে। পড়ার পর এখানে এসে চিহ্নিত করুন। ইসলামী জ্ঞানে সমৃদ্ধ হোন প্রতিদিন।',
  keywords: 'হাদিস, ইসলাম, দৈনিক হাদিস, বাংলা হাদিস, সহীহ বুখারী, সহীহ মুসলিম',
  authors: [{ name: 'Amar Hadith Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'আমার হাদিস - দৈনিক হাদিস অধ্যয়ন',
    description: 'প্রতিদিন ৩টি হাদিস পান আপনার ইমেইলে। পড়ার পর এখানে এসে চিহ্নিত করুন।',
    type: 'website',
    locale: 'bn_BD',
    siteName: 'আমার হাদিস',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আমার হাদিস - দৈনিক হাদিস অধ্যয়ন',
    description: 'প্রতিদিন ৩টি হাদিস পান আপনার ইমেইলে।',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" dir="ltr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
