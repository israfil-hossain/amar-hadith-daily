# 🕌 আমার হাদিস - Daily Hadith Learning Platform

<div align="center">

![আমার হাদিস](https://img.shields.io/badge/আমার_হাদিস-Islamic_Learning-10B981?style=for-the-badge&logo=mosque)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**একটি comprehensive Islamic hadith learning platform যা দৈনিক হাদিস অধ্যয়ন, progress tracking, এবং community engagement প্রদান করে।**

[🚀 Live Demo](https://amar-hadith-daily.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/israfil-hossain/amar-hadith-daily/issues) • [✨ Request Feature](https://github.com/israfil-hossain/amar-hadith-daily/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🗄️ Database Schema](#️-database-schema)
- [🎨 UI Components](#-ui-components)
- [📧 Email System](#-email-system)
- [🔐 Authentication](#-authentication)
- [🌐 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Features
- **📚 Daily Hadith Delivery** - 3 curated hadith every day ✅
- **📊 Progress Tracking** - Streak counting, points system, levels ✅
- **🏆 Gamification** - 10 achievements with progress tracking ✅
- **⭐ Personal Collections** - Save and organize favorite hadith ✅
- **🔍 Advanced Search** - Multi-language search across all content ✅
- **📱 Mobile Responsive** - Perfect experience on all devices ✅
- **🔐 Authentication** - Email/password + Google OAuth ✅

### 🕌 Islamic Features
- **🕐 Prayer Times** - Location-based prayer schedule ✅
- **📅 Islamic Calendar** - Hijri date display with special occasions ✅
- **🌙 Special Occasions** - Ramadan progress, Friday highlights ✅
- **📖 Authentic Sources** - 1000+ hadith from Sahih Bukhari, Muslim ✅
- **🌍 Multi-language** - Bengali, Arabic, English support ✅

### 👥 Community Features
- **🤝 Contributions** - Step-by-step hadith submission form ✅
- **⭐ Rating System** - Community-driven quality control ✅
- **💬 Comments** - Threaded discussions with likes and replies ✅
- **📤 Sharing** - Social media + image download + copy text ✅
- **👨‍🏫 Scholar System** - Expert verification and moderation ✅
- **🏆 Leaderboards** - Weekly, monthly, all-time rankings ✅

### 🔔 Notification System
- **📧 Email Notifications** - Beautiful HTML templates for daily hadith ✅
- **🏆 Achievement Alerts** - Celebrate progress with email notifications ✅
- **🔔 Prayer Reminders** - Automated prayer time alerts ✅
- **� In-app Alerts** - Real-time updates and notifications ✅

### 🆕 Latest Updates
- **🎮 Complete Gamification** - Achievement system with 10 different badges
- **📅 Islamic Calendar Integration** - Full Hijri calendar with events
- **💬 Advanced Comments** - Threaded discussions with moderation
- **� Enhanced Sharing** - Multiple platforms + image generation
- **📊 Smart Analytics** - Detailed progress and engagement tracking
- **🎯 Intelligent Fallbacks** - 1000+ hadith database with smart loading

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **State Management:** React Context
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Email Service:** Resend
- **File Storage:** Supabase Storage
- **API:** Next.js API Routes

### External Services
- **Prayer Times:** Aladhan API
- **Push Notifications:** Web Push (VAPID)
- **Email Templates:** Custom HTML templates

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- Resend account (for emails)

### 1-Minute Setup
```bash
# Clone the repository
git clone https://github.com/israfil-hossain/amar-hadith-daily.git
cd amar-hadith-daily

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Seed database with 1000 hadith
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the application.

---

## ⚙️ Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/israfil-hossain/amar-hadith-daily.git
cd amar-hadith-daily
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Setup
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Optional: App URL for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Database Setup
1. Create a new Supabase project
2. Run the SQL scripts in order:
   ```sql
   -- 1. Run supabase-schema.sql in Supabase SQL Editor
   -- 2. Run sample-data.sql for initial data
   ```

### Step 5: Start Development
```bash
npm run dev
```

---

## 🔧 Configuration

### Supabase Setup
1. **Create Project:** Go to [supabase.com](https://supabase.com)
2. **Get Credentials:** Project Settings → API
3. **Database Schema:** Run `supabase-schema.sql`
4. **Sample Data:** Run `sample-data.sql`

### Resend Email Setup
1. **Create Account:** Go to [resend.com](https://resend.com)
2. **Get API Key:** Dashboard → API Keys
3. **Verify Domain:** (Optional for production)

### VAPID Keys Generation
```bash
npx web-push generate-vapid-keys
```

---

## 📱 Usage

### For Users
1. **Sign Up:** Create account with email/password
2. **Daily Reading:** Check today's hadith (3 per day)
3. **Track Progress:** Mark hadith as read to maintain streak
4. **Explore Content:** Browse by categories or books
5. **Personal Collections:** Save favorites and create custom collections

### For Moderators
1. **Review Contributions:** Approve/reject community submissions
2. **Content Management:** Edit and organize hadith
3. **User Management:** Monitor user activities

### For Developers
1. **API Integration:** Use built-in API endpoints
2. **Custom Components:** Extend UI with Shadcn/ui
3. **Database Queries:** Direct Supabase integration

---

## 🗄️ Database Schema

### Core Tables
```sql
profiles              -- User accounts and preferences
hadith               -- Main hadith content
hadith_books         -- Reference books (Bukhari, Muslim, etc.)
hadith_categories    -- Topics (Faith, Prayer, etc.)
user_hadith_interactions -- Reading history, favorites
user_progress        -- Daily progress tracking
achievements         -- Gamification system
notifications        -- System notifications
```

### Relationships
- Users have many interactions with hadith
- Hadith belong to books and categories
- Progress tracks daily user activity
- Achievements unlock based on user actions

**📖 [View Complete Schema](./docs/database-schema.md)**

---

## 🎨 UI Components

### Core Components
- `HadithCard` - Main content display with Arabic/Bengali text
- `PrayerTimes` - Prayer schedule widget
- `WeeklySummary` - Progress overview dashboard
- `HadithRating` - Community rating system
- `Header` - Navigation with mobile menu

### Design System
- **Colors:** Islamic Green (#10B981), Warm Cream, Sage Green
- **Typography:** Bengali + Arabic font support
- **Layout:** Responsive grid system
- **Accessibility:** WCAG 2.1 compliant

**🎨 [View Component Library](./docs/components.md)**

---

## 📧 Email System

### Email Types
1. **Welcome Email** - New user onboarding
2. **Daily Hadith** - Daily content delivery
3. **Prayer Reminders** - Prayer time notifications
4. **Weekly Summary** - Progress reports

### Features
- Beautiful HTML templates with Islamic design
- Responsive design for all devices
- Personalization with user names
- Unsubscribe options

**📧 [View Email Templates](./docs/email-templates.md)**

---

## 🔐 Authentication

### Features
- Email/password authentication via Supabase
- JWT-based session management
- Role-based access control (User, Moderator, Admin, Scholar)
- Row Level Security (RLS) on all user data
- Protected routes with middleware

### User Roles
- **User:** Basic access, can read and favorite hadith
- **Moderator:** Can review community contributions
- **Admin:** Full system access and user management
- **Scholar:** Can verify hadith authenticity

**🔐 [View Auth Documentation](./docs/authentication.md)**

---

## 🌐 API Reference

### Authentication Endpoints
```typescript
POST /api/auth/signup     // User registration
POST /api/auth/login      // User login
POST /api/auth/logout     // User logout
```

### Hadith Endpoints
```typescript
GET  /api/hadith/daily    // Get today's hadith
GET  /api/hadith/search   // Search hadith
POST /api/hadith/rate     // Rate hadith
```

### User Endpoints
```typescript
GET  /api/user/progress   // Get user progress
POST /api/user/favorite   // Toggle favorite
GET  /api/user/stats      // Get user statistics
```

**🌐 [View Complete API Documentation](./docs/api-reference.md)**

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Islamic Sources:** All hadith content from authentic Islamic sources
- **Community:** Thanks to all contributors and users
- **Open Source:** Built with amazing open-source technologies

---

## 📞 Support

- **Documentation:** [docs/](./docs)
- **Issues:** [GitHub Issues](https://github.com/israfil-hossain/amar-hadith-daily/issues)
- **Discussions:** [GitHub Discussions](https://github.com/israfil-hossain/amar-hadith-daily/discussions)
- **Email:** support@amarhadith.com

---

<div align="center">

**Made with ❤️ for the Muslim Ummah**

[⭐ Star this repo](https://github.com/israfil-hossain/amar-hadith-daily) • [🐛 Report Issues](https://github.com/israfil-hossain/amar-hadith-daily/issues) • [💬 Join Discussion](https://github.com/israfil-hossain/amar-hadith-daily/discussions)

</div>
