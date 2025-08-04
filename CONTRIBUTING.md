# 🤝 Contributing to আমার হাদিস

আমরা আমার হাদিস project এ আপনার contribution স্বাগত জানাই! এই guide আপনাকে contribute করার process সম্পর্কে জানাবে।

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Coding Standards](#-coding-standards)
- [Testing](#-testing)
- [Documentation](#-documentation)

## 🌟 Code of Conduct

### Our Pledge
আমরা একটি welcoming, inclusive, এবং harassment-free environment তৈরি করতে প্রতিশ্রুতিবদ্ধ। সব contributors, maintainers, এবং users এর সাথে respect এবং dignity এর সাথে আচরণ করুন।

### Islamic Values
এই project Islamic principles এর উপর ভিত্তি করে তৈরি। আমরা expect করি যে সব contributors এই values respect করবেন:

- **Honesty (সততা):** Accurate information এবং authentic sources
- **Respect (সম্মান):** সব community members এর প্রতি respect
- **Knowledge (জ্ঞান):** Islamic knowledge এর proper representation
- **Community (সমাজ):** Collaborative এবং supportive environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Git
- Supabase account (for database)
- Resend account (for emails)

### First Contribution
1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/amar-hadith-daily.git
   cd amar-hadith-daily
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Environment Variables
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
RESEND_API_KEY=your_resend_key

# Optional
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public
VAPID_PRIVATE_KEY=your_vapid_private
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Database Setup
1. Create Supabase project
2. Run `supabase-schema.sql` in SQL Editor
3. Run `sample-data.sql` for test data

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## 📝 Contributing Guidelines

### Types of Contributions

#### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide screenshots if applicable
- Mention your environment (OS, browser, etc.)

#### ✨ Feature Requests
- Use the feature request template
- Explain the use case
- Consider Islamic context if applicable
- Provide mockups or examples if possible

#### 📚 Content Contributions
- **Hadith Submissions:** Follow authentic sources
- **Translations:** Ensure accuracy
- **Categories:** Maintain consistency
- **Explanations:** Keep them simple and accurate

#### 🔧 Code Contributions
- **Bug Fixes:** Include tests
- **New Features:** Discuss in issues first
- **Performance:** Measure improvements
- **UI/UX:** Follow design system

### What We're Looking For
- **High-quality hadith content** from authentic sources
- **UI/UX improvements** for better user experience
- **Performance optimizations**
- **Accessibility improvements**
- **Mobile responsiveness**
- **Test coverage** improvements
- **Documentation** updates

## 🔄 Pull Request Process

### Before Submitting
1. **Check existing issues** and PRs
2. **Create an issue** for discussion (for major changes)
3. **Fork and create branch** from `main`
4. **Follow naming conventions**
   ```bash
   git checkout -b feature/prayer-times-widget
   git checkout -b fix/hadith-card-responsive
   git checkout -b docs/api-documentation
   ```

### PR Requirements
- [ ] **Clear title** and description
- [ ] **Link to related issue**
- [ ] **Tests added/updated** (if applicable)
- [ ] **Documentation updated** (if applicable)
- [ ] **Screenshots** for UI changes
- [ ] **No breaking changes** (or clearly documented)
- [ ] **Code follows style guide**
- [ ] **All checks pass**

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Issue Guidelines

### Bug Reports
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

### Feature Requests
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Islamic Context**
How does this feature align with Islamic values?

**Additional context**
Add any other context or screenshots.
```

## 💻 Coding Standards

### TypeScript
```typescript
// Use proper types
interface HadithCardProps {
  hadith: Hadith
  onMarkAsRead?: (hadithId: string) => void
  compact?: boolean
}

// Use meaningful names
const fetchDailyHadith = async (): Promise<Hadith[]> => {
  // Implementation
}

// Add JSDoc for complex functions
/**
 * Calculates prayer times for given location
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @param date - Date for calculation (optional)
 * @returns Promise<PrayerTimes>
 */
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date?: string
): Promise<PrayerTimes> {
  // Implementation
}
```

### React Components
```tsx
// Use functional components with hooks
export function HadithCard({ hadith, onMarkAsRead, compact = false }: HadithCardProps) {
  const [isRead, setIsRead] = useState(hadith.is_read)
  
  const handleMarkAsRead = useCallback(() => {
    setIsRead(true)
    onMarkAsRead?.(hadith.id)
  }, [hadith.id, onMarkAsRead])
  
  return (
    <Card className={cn("w-full", compact && "p-2")}>
      {/* Component content */}
    </Card>
  )
}
```

### CSS/Styling
```css
/* Use Tailwind CSS classes */
.hadith-card {
  @apply bg-white rounded-lg shadow-md p-6 mb-4;
}

/* Custom CSS for specific needs */
.arabic-text {
  direction: rtl;
  text-align: right;
  font-family: 'Times New Roman', serif;
  line-height: 1.8;
}
```

### File Organization
```
components/
├── ui/              # Reusable UI components
├── HadithCard.tsx   # Feature-specific components
├── PrayerTimes.tsx
└── index.ts         # Export barrel

lib/
├── supabase.ts      # Database client
├── email.ts         # Email utilities
└── utils.ts         # General utilities

types/
├── database.ts      # Database types
└── index.ts         # General types
```

## 🧪 Testing

### Unit Tests
```typescript
// components/__tests__/HadithCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { HadithCard } from '../HadithCard'

const mockHadith = {
  id: '1',
  text_bangla: 'Test hadith',
  narrator: 'Test narrator'
}

test('renders hadith content', () => {
  render(<HadithCard hadith={mockHadith} />)
  
  expect(screen.getByText('Test hadith')).toBeInTheDocument()
  expect(screen.getByText('Test narrator')).toBeInTheDocument()
})

test('calls onMarkAsRead when button clicked', () => {
  const mockOnMarkAsRead = jest.fn()
  
  render(
    <HadithCard 
      hadith={mockHadith} 
      onMarkAsRead={mockOnMarkAsRead} 
    />
  )
  
  fireEvent.click(screen.getByText('Mark as Read'))
  expect(mockOnMarkAsRead).toHaveBeenCalledWith('1')
})
```

### Integration Tests
```typescript
// __tests__/api/hadith.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/hadith/daily'

test('/api/hadith/daily returns daily hadith', async () => {
  const { req, res } = createMocks({
    method: 'GET',
    headers: {
      authorization: 'Bearer valid-token'
    }
  })
  
  await handler(req, res)
  
  expect(res._getStatusCode()).toBe(200)
  
  const data = JSON.parse(res._getData())
  expect(data.success).toBe(true)
  expect(data.data).toHaveLength(3)
})
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test HadithCard.test.tsx
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Include examples in complex functions
- Document component props with TypeScript interfaces
- Add README files for complex modules

### API Documentation
- Update API documentation for new endpoints
- Include request/response examples
- Document error codes and messages
- Add authentication requirements

### User Documentation
- Update user guides for new features
- Add screenshots for UI changes
- Translate documentation to Bengali
- Include Islamic context where relevant

## 🎯 Specific Contribution Areas

### Content Contributions
- **Hadith Verification:** Ensure authenticity
- **Translation Quality:** Accurate Bengali translations
- **Category Organization:** Logical grouping
- **Explanation Writing:** Simple, clear explanations

### Technical Contributions
- **Performance:** Optimize loading times
- **Accessibility:** WCAG 2.1 compliance
- **Mobile:** Responsive design improvements
- **SEO:** Search engine optimization

### Design Contributions
- **UI/UX:** User experience improvements
- **Islamic Design:** Culturally appropriate aesthetics
- **Responsive:** Mobile-first design
- **Accessibility:** Color contrast, font sizes

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- About page on the website
- Annual contributor appreciation

### Hadith Contributors
Special recognition for:
- Authentic hadith submissions
- Quality translations
- Scholarly reviews
- Educational content

## 📞 Getting Help

### Communication Channels
- **GitHub Issues:** For bugs and features
- **GitHub Discussions:** For questions and ideas
- **Email:** contribute@amarhadith.com

### Mentorship
New contributors can request mentorship for:
- First-time contributions
- Complex features
- Islamic content guidance
- Technical architecture

---

## 🙏 Thank You

জাজাকাল্লাহু খাইরান for your interest in contributing to আমার হাদিস! Your contributions help spread Islamic knowledge and benefit the Muslim Ummah.

**Remember:** Every contribution, no matter how small, is valuable. Whether it's fixing a typo, adding a hadith, or building a new feature - your effort makes a difference.

---

<div align="center">

**"The best of people are those who benefit others"** - Prophet Muhammad (ﷺ)

</div>
