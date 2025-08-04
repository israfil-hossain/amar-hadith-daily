# 🎨 UI Components Documentation

## Overview
আমার হাদিস application এর UI components Shadcn/ui এর উপর base করে তৈরি। সব components TypeScript এ লেখা এবং fully responsive।

## 🏗️ Component Architecture

### Design System
```typescript
// Color Palette
const colors = {
  'islamic-green': '#10B981',
  'islamic-gold': '#F59E0B', 
  'warm-cream': '#FEF3C7',
  'sage-green': '#6EE7B7'
}

// Typography Scale
const typography = {
  'heading-1': '2.25rem', // 36px
  'heading-2': '1.875rem', // 30px
  'heading-3': '1.5rem', // 24px
  'body': '1rem', // 16px
  'small': '0.875rem' // 14px
}
```

## 📚 Core Components

### 1. HadithCard
Main component for displaying hadith content.

**Location:** `components/HadithCard.tsx`

**Props:**
```typescript
interface HadithCardProps {
  hadith: Hadith
  onMarkAsRead?: (hadithId: string) => void
  onToggleFavorite?: (hadithId: string) => void
  onRate?: (hadithId: string, rating: number) => void
  compact?: boolean
  showActions?: boolean
}
```

**Usage:**
```tsx
<HadithCard 
  hadith={hadithData}
  onMarkAsRead={handleMarkAsRead}
  onToggleFavorite={handleToggleFavorite}
  showActions={true}
/>
```

**Features:**
- Arabic text with proper RTL direction
- Bengali translation with beautiful typography
- Interactive rating system
- Favorite/bookmark functionality
- Social sharing buttons
- Audio playback (if available)
- Responsive design

**Example:**
```tsx
export function HadithCard({ hadith, onMarkAsRead, compact = false }: HadithCardProps) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {hadith.book?.name_bangla} • {hadith.hadith_number}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Arabic Text */}
        <div className="text-center p-6 bg-gradient-to-r from-warm-cream to-islamic-gold/10 rounded-lg mb-4">
          <p className="text-2xl leading-relaxed font-arabic text-right" dir="rtl">
            {hadith.text_arabic}
          </p>
        </div>
        
        {/* Bengali Translation */}
        <div className="bg-islamic-green/5 p-4 rounded-lg">
          <p className="text-lg leading-relaxed text-gray-800">
            {hadith.text_bangla}
          </p>
        </div>
        
        {/* Narrator & Reference */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>বর্ণনাকারী:</strong> {hadith.narrator}</p>
          <p><strong>সূত্র:</strong> {hadith.reference}</p>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2. PrayerTimes
Prayer schedule widget with location-based timings.

**Location:** `components/PrayerTimes.tsx`

**Props:**
```typescript
interface PrayerTimesProps {
  compact?: boolean
}
```

**Features:**
- Real-time prayer times
- Location detection
- Next prayer countdown
- Prayer notifications toggle
- Islamic date display
- Special occasion highlights

### 3. WeeklySummary
User progress overview component.

**Location:** `components/WeeklySummary.tsx`

**Features:**
- Weekly progress visualization
- Streak tracking
- Achievement highlights
- Daily breakdown
- Goal progress
- Motivational messages

### 4. Header
Main navigation component.

**Location:** `components/Header.tsx`

**Features:**
- Responsive navigation
- User profile dropdown
- Mobile hamburger menu
- Authentication state
- Multi-language support
- Search integration

### 5. HadithRating
Interactive rating component for hadith quality.

**Location:** `components/HadithRating.tsx`

**Props:**
```typescript
interface HadithRatingProps {
  hadithId: string
  currentRating?: number
  onRate: (rating: number) => void
  showDetails?: boolean
}
```

**Features:**
- 5-star rating system
- Translation quality rating
- Explanation quality rating
- Comment submission
- Visual feedback

## 🎯 Specialized Components

### 6. DailyHadithSection
Main section for daily hadith display.

**Features:**
- Today's hadith carousel
- Progress tracking
- Quick actions
- Loading states
- Error handling

### 7. CategoryGrid
Grid layout for hadith categories.

**Features:**
- Icon-based categories
- Color-coded themes
- Responsive grid
- Hover effects
- Category statistics

### 8. SearchResults
Search results display component.

**Features:**
- Highlighted search terms
- Filter options
- Pagination
- Sort options
- Loading states

### 9. UserProfile
User profile display and editing.

**Features:**
- Avatar upload
- Profile information
- Statistics display
- Settings management
- Achievement showcase

### 10. NotificationCenter
In-app notification system.

**Features:**
- Real-time notifications
- Mark as read/unread
- Notification types
- Action buttons
- Notification history

## 🔧 Utility Components

### 11. LoadingSpinner
Reusable loading component.

```tsx
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn(
        "animate-spin",
        size === "sm" && "w-4 h-4",
        size === "default" && "w-6 h-6", 
        size === "lg" && "w-8 h-8"
      )} />
    </div>
  )
}
```

### 12. ErrorBoundary
Error handling component.

```tsx
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryComponent
      fallback={fallback || <ErrorFallback />}
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
```

### 13. EmptyState
Empty state placeholder.

```tsx
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action}
    </div>
  )
}
```

## 🎨 Design Patterns

### 1. Compound Components
```tsx
// Usage
<HadithCard>
  <HadithCard.Header>
    <HadithCard.Badge />
    <HadithCard.Actions />
  </HadithCard.Header>
  <HadithCard.Content>
    <HadithCard.Arabic />
    <HadithCard.Translation />
    <HadithCard.Metadata />
  </HadithCard.Content>
  <HadithCard.Footer>
    <HadithCard.Rating />
    <HadithCard.Share />
  </HadithCard.Footer>
</HadithCard>
```

### 2. Render Props
```tsx
<DataFetcher url="/api/hadith/daily">
  {({ data, loading, error }) => (
    loading ? <LoadingSpinner /> :
    error ? <ErrorMessage error={error} /> :
    <HadithCard hadith={data} />
  )}
</DataFetcher>
```

### 3. Custom Hooks
```tsx
// useHadithInteraction hook
export function useHadithInteraction(hadithId: string) {
  const [isRead, setIsRead] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  
  const markAsRead = useCallback(async () => {
    // API call
    setIsRead(true)
  }, [hadithId])
  
  return { isRead, isFavorited, markAsRead }
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.container {
  @apply px-4;
}

@media (min-width: 640px) {
  .container {
    @apply px-6;
  }
}

@media (min-width: 1024px) {
  .container {
    @apply px-8;
  }
}
```

### Mobile Optimizations
- Touch-friendly button sizes (min 44px)
- Swipe gestures for navigation
- Optimized font sizes
- Collapsible sections
- Bottom navigation for mobile

## 🌐 Internationalization

### Language Support
```tsx
// useTranslation hook
export function useTranslation() {
  const { language } = useAuth()
  
  const t = useCallback((key: string) => {
    return translations[language][key] || key
  }, [language])
  
  return { t, language }
}

// Usage
const { t } = useTranslation()
return <h1>{t('daily_hadith')}</h1>
```

### RTL Support
```css
/* Arabic text styling */
.arabic-text {
  direction: rtl;
  text-align: right;
  font-family: 'Amiri', 'Times New Roman', serif;
  line-height: 1.8;
}
```

## ♿ Accessibility

### ARIA Labels
```tsx
<Button 
  aria-label="Mark hadith as favorite"
  aria-pressed={isFavorited}
>
  <Heart className="w-4 h-4" />
</Button>
```

### Keyboard Navigation
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    onToggleFavorite()
  }
}
```

### Screen Reader Support
```tsx
<div role="article" aria-labelledby="hadith-title">
  <h2 id="hadith-title" className="sr-only">
    Hadith from {book.name_bangla}
  </h2>
  {/* Content */}
</div>
```

## 🧪 Testing

### Component Testing
```tsx
// HadithCard.test.tsx
import { render, screen } from '@testing-library/react'
import { HadithCard } from './HadithCard'

test('renders hadith content correctly', () => {
  const mockHadith = {
    text_bangla: 'Test hadith text',
    narrator: 'Test narrator'
  }
  
  render(<HadithCard hadith={mockHadith} />)
  
  expect(screen.getByText('Test hadith text')).toBeInTheDocument()
  expect(screen.getByText('Test narrator')).toBeInTheDocument()
})
```

### Visual Testing
```tsx
// Storybook stories
export default {
  title: 'Components/HadithCard',
  component: HadithCard,
}

export const Default = () => (
  <HadithCard hadith={mockHadithData} />
)

export const Compact = () => (
  <HadithCard hadith={mockHadithData} compact />
)
```

## 🚀 Performance

### Optimization Techniques
1. **Lazy Loading:** Components loaded on demand
2. **Memoization:** React.memo for expensive components
3. **Virtual Scrolling:** For long lists
4. **Image Optimization:** Next.js Image component
5. **Code Splitting:** Dynamic imports

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

---

এই component library modern React patterns follow করে এবং scalable, maintainable, এবং accessible UI প্রদান করে।
