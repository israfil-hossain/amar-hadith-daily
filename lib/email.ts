import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    // Use environment variable for from email or default
    const fromEmail = from || process.env.FROM_EMAIL || 'noreply@amarhadith.com'
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('Email sending error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  welcome: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>আমার হাদিসে স্বাগতম</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2d5a27, #d4af37);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }
        .title {
          color: #2d5a27;
          font-size: 24px;
          margin: 0;
        }
        .content {
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #2d5a27, #d4af37);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📖</div>
          <h1 class="title">আমার হাদিসে স্বাগতম</h1>
        </div>
        
        <div class="content">
          <p>আসসালামু আলাইকুম ${userName},</p>
          
          <p>আমার হাদিস পরিবারে আপনাকে স্বাগতম! আপনি এখন প্রতিদিন সহীহ হাদিস পড়ার একটি সুন্দর যাত্রা শুরু করেছেন।</p>
          
          <p><strong>আপনি যা পাবেন:</strong></p>
          <ul>
            <li>প্রতিদিন ৩টি নির্বাচিত হাদিস</li>
            <li>আপনার পড়ার অগ্রগতি ট্র্যাকিং</li>
            <li>পছন্দের হাদিস সংরক্ষণ</li>
            <li>ইসলামিক ক্যালেন্ডার ও নামাজের সময়</li>
          </ul>
          
          <p>আজই শুরু করুন আপনার ইসলামিক জ্ঞান অর্জনের যাত্রা:</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://amarhadith.com'}" class="button">
            আজকের হাদিস পড়ুন
          </a>
        </div>
        
        <div class="footer">
          <p>আল্লাহ আপনাকে বরকত দান করুন।</p>
          <p>আমার হাদিস টিম</p>
          <p><small>এই ইমেইলটি পেতে না চাইলে <a href="#">আনসাবস্ক্রাইব</a> করুন।</small></p>
        </div>
      </div>
    </body>
    </html>
  `,

  dailyHadith: (hadithList: any[]) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>আজকের হাদিস</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2d5a27;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2d5a27, #d4af37);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }
        .title {
          color: #2d5a27;
          font-size: 24px;
          margin: 0;
        }
        .date {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
        .hadith-card {
          background: #f8f9fa;
          border-left: 4px solid #2d5a27;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .hadith-text {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 15px;
          font-style: italic;
        }
        .hadith-source {
          color: #2d5a27;
          font-weight: bold;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #2d5a27, #d4af37);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px auto;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📖</div>
          <h1 class="title">আজকের হাদিস</h1>
          <div class="date">${new Date().toLocaleDateString('bn-BD', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
        
        ${hadithList.map((hadith, index) => `
          <div class="hadith-card">
            <div class="hadith-text">
              "${hadith.text_bengali || hadith.text_arabic || 'হাদিস লোড হচ্ছে...'}"
            </div>
            <div class="hadith-source">
              ${hadith.book_name || 'সহীহ বুখারী'} - ${hadith.hadith_number || index + 1}
            </div>
          </div>
        `).join('')}
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://amarhadith.com'}" class="button">
            আরও হাদিস পড়ুন
          </a>
        </div>
        
        <div class="footer">
          <p>প্রতিদিন ইসলামিক জ্ঞানে সমৃদ্ধ হন।</p>
          <p>আমার হাদিস টিম</p>
          <p><small>এই ইমেইলটি পেতে না চাইলে <a href="#">আনসাবস্ক্রাইব</a> করুন।</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Helper function to send welcome email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  return sendEmail({
    to: userEmail,
    subject: 'আমার হাদিসে স্বাগতম! 🌟',
    html: emailTemplates.welcome(userName)
  })
}

// Helper function to send daily hadith email
export async function sendDailyHadithEmail(userEmail: string, hadithList: any[]) {
  return sendEmail({
    to: userEmail,
    subject: `আজকের হাদিস - ${new Date().toLocaleDateString('bn-BD')}`,
    html: emailTemplates.dailyHadith(hadithList)
  })
}

// Fallback email service (if Resend is not available)
export async function sendEmailFallback({ to, subject, html }: EmailOptions) {
  console.log('📧 Email would be sent to:', to)
  console.log('📧 Subject:', subject)
  console.log('📧 Content preview:', html.substring(0, 100) + '...')
  
  // In development, just log the email
  if (process.env.NODE_ENV === 'development') {
    return { success: true, data: { id: 'dev-email-' + Date.now() } }
  }
  
  // In production without email service, return success but log warning
  console.warn('⚠️ Email service not configured. Email not sent.')
  return { success: true, data: { id: 'fallback-' + Date.now() } }
}
