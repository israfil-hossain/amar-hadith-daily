import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
]

interface LanguageSwitcherProps {
  compact?: boolean
}

export const LanguageSwitcher = ({ compact = false }: LanguageSwitcherProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('bn')

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    
    // Store in localStorage
    localStorage.setItem('preferred-language', languageCode)
    
    // You can also dispatch a custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }))
    
    // For now, we'll just show a notification
    // In a real app, you'd implement proper i18n
    console.log(`Language changed to: ${languageCode}`)
  }

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{getCurrentLanguage().flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4 text-islamic-green" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span>{getCurrentLanguage().flag}</span>
            <span>{getCurrentLanguage().nativeName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{language.name}</div>
                </div>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4 text-islamic-green" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Hook to use current language in components
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('bn')

  useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('preferred-language')
    if (saved && languages.find(lang => lang.code === saved)) {
      setCurrentLanguage(saved)
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  })

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  const t = (translations: Record<string, string>) => {
    return translations[currentLanguage] || translations['bn'] || Object.values(translations)[0]
  }

  return {
    currentLanguage,
    getCurrentLanguage,
    t, // Translation function
    languages
  }
}
