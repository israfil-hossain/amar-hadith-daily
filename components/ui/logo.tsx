import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'green' | 'muted'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const variantClasses = {
  default: 'text-primary-foreground',
  white: 'text-white',
  green: 'text-islamic-green',
  muted: 'text-muted-foreground'
}

export function Logo({ className, size = 'lg', variant = 'default' }: LogoProps) {
  return (
    <svg 
      className={cn(sizeClasses[size], variantClasses[variant], className)} 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
    </svg>
  )
}

export default Logo
