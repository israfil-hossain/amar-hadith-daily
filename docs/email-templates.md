# 📧 Email Templates Documentation

## Overview
আমার হাদিস application এর email system Resend service ব্যবহার করে beautiful, responsive HTML templates প্রদান করে। সব emails Islamic design principles follow করে।

## 🎨 Design System

### Color Palette
```css
:root {
  --islamic-green: #10B981;
  --islamic-gold: #F59E0B;
  --warm-cream: #FEF3C7;
  --sage-green: #6EE7B7;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
}
```

### Typography
```css
.email-container {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #374151;
}

.arabic-text {
  font-family: 'Times New Roman', serif;
  direction: rtl;
  text-align: right;
  line-height: 1.8;
}

.bangla-text {
  font-family: Arial, sans-serif;
  line-height: 1.7;
}
```

## 📧 Email Templates

### 1. Welcome Email
**Trigger:** New user registration
**Purpose:** Onboard new users and introduce features

**Template Structure:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🕌 আমার হাদিস</h1>
    <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 16px;">দৈনিক হাদিস অধ্যয়ন</p>
  </div>
  
  <!-- Content -->
  <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #10B981; margin-top: 0;">আসসালামু আলাইকুম {{userName}}!</h2>
    
    <p style="color: #374151; line-height: 1.6; font-size: 16px;">
      আমার হাদিস পরিবারে আপনাকে স্বাগতম! আপনি এখন প্রতিদিন ৩টি করে নির্বাচিত হাদিস পাবেন যা আপনার ইসলামী জ্ঞান বৃদ্ধিতে সহায়ক হবে।
    </p>
    
    <!-- Features List -->
    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
      <h3 style="color: #10B981; margin-top: 0;">আপনি যা পাবেন:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li>📚 প্রতিদিন ৩টি নির্বাচিত হাদিস</li>
        <li>🕌 নামাজের সময়সূচী</li>
        <li>📊 আপনার অগ্রগতি ট্র্যাকিং</li>
        <li>⭐ পছন্দের হাদিস সংরক্ষণ</li>
        <li>🤝 কমিউনিটিতে অবদান রাখার সুযোগ</li>
      </ul>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{appUrl}}" 
         style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        আজই শুরু করুন
      </a>
    </div>
    
    <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
      আল্লাহ আপনাকে উত্তম প্রতিদান দিন। বারাকাল্লাহু ফিকুম।
    </p>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
    <p>© ২০২৪ আমার হাদিস। সকল অধিকার সংরক্ষিত।</p>
  </div>
</div>
```

**Implementation:**
```typescript
// lib/email.ts
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const { data, error } = await resend.emails.send({
    from: 'আমার হাদিস <noreply@yourdomain.com>',
    to: userEmail,
    subject: 'আমার হাদিসে স্বাগতম! 🕌',
    html: welcomeEmailTemplate({ userName, appUrl: process.env.NEXT_PUBLIC_APP_URL })
  })
  
  return { success: !error, data, error }
}
```

### 2. Daily Hadith Email
**Trigger:** Daily scheduled send (morning)
**Purpose:** Deliver daily hadith content

**Features:**
- 3 hadith per email
- Arabic text with proper RTL styling
- Bengali translation
- Narrator and reference information
- Beautiful card-based layout
- CTA to mark as read

**Template Preview:**
```html
<!-- Daily Hadith Email Structure -->
<div class="email-container">
  <!-- Header with date -->
  <div class="header">
    <h1>🕌 আজকের হাদিস</h1>
    <p>{{currentDate}}</p>
  </div>
  
  <!-- Hadith Cards -->
  {{#each hadithList}}
  <div class="hadith-card">
    <div class="hadith-header">
      <h3>হাদিস {{@index}}</h3>
      <p>{{book.name_bangla}} • {{hadith_number}}</p>
    </div>
    
    <!-- Arabic Text -->
    <div class="arabic-section">
      <p class="arabic-text">{{text_arabic}}</p>
    </div>
    
    <!-- Bengali Translation -->
    <div class="bangla-section">
      <p class="bangla-text">{{text_bangla}}</p>
    </div>
    
    <!-- Metadata -->
    <div class="metadata">
      <p><strong>বর্ণনাকারী:</strong> {{narrator}}</p>
    </div>
  </div>
  {{/each}}
  
  <!-- CTA -->
  <div class="cta-section">
    <a href="{{appUrl}}" class="cta-button">
      পঠিত হিসেবে চিহ্নিত করুন
    </a>
  </div>
</div>
```

### 3. Prayer Reminder Email
**Trigger:** Before each prayer time
**Purpose:** Remind users of prayer times

**Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 25px; border-radius: 10px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🕌 নামাজের সময়</h1>
    <h2 style="color: #f0f9ff; margin: 15px 0 0 0; font-size: 28px;">{{prayerName}}</h2>
    <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 18px;">{{prayerTime}}</p>
  </div>
  
  <div style="background: white; padding: 25px; border-radius: 10px; margin-top: 20px; text-align: center;">
    <p style="color: #374151; font-size: 16px; margin: 0 0 15px 0;">আসসালামু আলাইকুম {{userName}},</p>
    <p style="color: #6B7280; font-size: 14px; margin: 0;">
      {{prayerName}} নামাজের সময় হয়েছে। আল্লাহ আপনাকে তাওফিক দিন।
    </p>
  </div>
</div>
```

### 4. Weekly Summary Email
**Trigger:** Every Sunday morning
**Purpose:** Show user's weekly progress

**Features:**
- Weekly statistics
- Progress visualization
- Achievement highlights
- Motivational content

**Template Structure:**
```html
<div class="weekly-summary">
  <!-- Header -->
  <div class="header">
    <h1>📊 সাপ্তাহিক সামারি</h1>
    <p>আপনার অগ্রগতি</p>
  </div>
  
  <!-- Stats Grid -->
  <div class="stats-grid">
    <div class="stat-card">
      <h3>{{totalHadithRead}}</h3>
      <p>মোট পঠিত</p>
    </div>
    <div class="stat-card">
      <h3>{{streakDays}}</h3>
      <p>ধারা দিন</p>
    </div>
  </div>
  
  <!-- Progress Message -->
  <div class="progress-message">
    <p>চমৎকার! এভাবেই চালিয়ে যান। আল্লাহ আপনাকে উত্তম প্রতিদান দিন।</p>
  </div>
</div>
```

## 🔧 Email Configuration

### Resend Setup
```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sending function
export async function sendEmail({
  to,
  subject,
  html,
  text
}: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'আমার হাদিস <noreply@yourdomain.com>',
      to,
      subject,
      html,
      text
    })

    if (error) {
      console.error('Email sending failed:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}
```

### Email Queue System
```typescript
// lib/emailQueue.ts
interface EmailJob {
  id: string
  type: 'welcome' | 'daily_hadith' | 'prayer_reminder' | 'weekly_summary'
  recipient: string
  data: any
  scheduledFor: Date
  attempts: number
  status: 'pending' | 'sent' | 'failed'
}

export class EmailQueue {
  private queue: EmailJob[] = []
  
  async addJob(job: Omit<EmailJob, 'id' | 'attempts' | 'status'>) {
    const emailJob: EmailJob = {
      ...job,
      id: generateId(),
      attempts: 0,
      status: 'pending'
    }
    
    this.queue.push(emailJob)
    await this.processQueue()
  }
  
  private async processQueue() {
    const pendingJobs = this.queue.filter(job => job.status === 'pending')
    
    for (const job of pendingJobs) {
      try {
        await this.sendEmail(job)
        job.status = 'sent'
      } catch (error) {
        job.attempts++
        if (job.attempts >= 3) {
          job.status = 'failed'
        }
      }
    }
  }
}
```

## 📱 Responsive Design

### Mobile Optimization
```css
/* Mobile-first responsive design */
@media only screen and (max-width: 600px) {
  .email-container {
    padding: 10px !important;
  }
  
  .hadith-card {
    padding: 15px !important;
    margin-bottom: 15px !important;
  }
  
  .arabic-text {
    font-size: 18px !important;
    line-height: 1.6 !important;
  }
  
  .cta-button {
    padding: 12px 20px !important;
    font-size: 14px !important;
  }
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  .email-container {
    background-color: #1f2937 !important;
    color: #f9fafb !important;
  }
  
  .hadith-card {
    background-color: #374151 !important;
    border: 1px solid #4b5563 !important;
  }
}
```

## 🌐 Internationalization

### Multi-language Support
```typescript
// Email templates with language support
const emailTemplates = {
  bn: {
    welcome: {
      subject: 'আমার হাদিসে স্বাগতম! 🕌',
      greeting: 'আসসালামু আলাইকুম {{userName}}!',
      content: 'আমার হাদিস পরিবারে আপনাকে স্বাগতম!'
    }
  },
  en: {
    welcome: {
      subject: 'Welcome to Amar Hadith! 🕌',
      greeting: 'Assalamu Alaikum {{userName}}!',
      content: 'Welcome to the Amar Hadith family!'
    }
  }
}

export function getEmailTemplate(type: string, language: string = 'bn') {
  return emailTemplates[language]?.[type] || emailTemplates.bn[type]
}
```

## 📊 Email Analytics

### Tracking Implementation
```typescript
// Email tracking
export async function trackEmailEvent(
  emailId: string, 
  event: 'sent' | 'opened' | 'clicked',
  metadata?: any
) {
  await supabase
    .from('email_analytics')
    .insert({
      email_id: emailId,
      event_type: event,
      metadata,
      timestamp: new Date().toISOString()
    })
}

// Open tracking pixel
const trackingPixel = `
  <img src="${process.env.NEXT_PUBLIC_APP_URL}/api/email/track/open?id={{emailId}}" 
       width="1" height="1" style="display:none;" />
`

// Click tracking
const trackableLink = (url: string, emailId: string) => 
  `${process.env.NEXT_PUBLIC_APP_URL}/api/email/track/click?url=${encodeURIComponent(url)}&id=${emailId}`
```

### Analytics Dashboard
```typescript
// Email performance metrics
export async function getEmailAnalytics(period: string = '30d') {
  const { data } = await supabase
    .from('email_analytics')
    .select(`
      event_type,
      created_at,
      email_type
    `)
    .gte('created_at', getDateRange(period))
  
  return {
    sent: data.filter(e => e.event_type === 'sent').length,
    opened: data.filter(e => e.event_type === 'opened').length,
    clicked: data.filter(e => e.event_type === 'clicked').length,
    openRate: calculateOpenRate(data),
    clickRate: calculateClickRate(data)
  }
}
```

## 🧪 Testing Email Templates

### Preview System
```typescript
// Email preview API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const template = searchParams.get('template')
  const language = searchParams.get('lang') || 'bn'
  
  const mockData = {
    userName: 'জন ডো',
    hadithList: mockHadithData,
    prayerName: 'ফজর',
    prayerTime: '৫:৩০'
  }
  
  const html = await renderEmailTemplate(template, mockData, language)
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
```

### A/B Testing
```typescript
// A/B test email variants
export async function sendABTestEmail(
  recipients: string[],
  variants: EmailVariant[]
) {
  const splitSize = Math.floor(recipients.length / variants.length)
  
  for (let i = 0; i < variants.length; i++) {
    const segment = recipients.slice(i * splitSize, (i + 1) * splitSize)
    
    for (const recipient of segment) {
      await sendEmail({
        to: recipient,
        subject: variants[i].subject,
        html: variants[i].html,
        variant: variants[i].id
      })
    }
  }
}
```

## 🔒 Security & Privacy

### Email Security
```typescript
// Email content sanitization
export function sanitizeEmailContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'style', 'class']
  })
}

// Unsubscribe handling
export async function handleUnsubscribe(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
  await supabase
    .from('profiles')
    .update({
      notification_settings: {
        email: false,
        push: true,
        prayer_reminders: false
      }
    })
    .eq('id', decoded.userId)
}
```

---

এই email system user engagement বৃদ্ধি করে এবং Islamic values এর সাথে modern email marketing best practices combine করে।
