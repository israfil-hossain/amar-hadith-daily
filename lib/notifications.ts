import { supabase } from './supabase'

export interface NotificationData {
  title: string
  message: string
  type: 'daily_hadith' | 'prayer_reminder' | 'achievement' | 'special_occasion' | 'streak_reminder'
  userId: string
  metadata?: any
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Send email notification
export const sendEmailNotification = async (
  to: string,
  template: EmailTemplate
): Promise<boolean> => {
  try {
    // In a real app, you would use a service like SendGrid, Mailgun, or AWS SES
    // For now, we'll simulate the email sending
    console.log('Sending email to:', to)
    console.log('Subject:', template.subject)
    console.log('Content:', template.text)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Create daily hadith email template
export const createDailyHadithEmailTemplate = (
  userName: string,
  hadithList: any[]
): EmailTemplate => {
  const hadithHtml = hadithList.map(hadith => `
    <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #10B981; background-color: #f8fafc;">
      <h3 style="color: #10B981; margin-bottom: 10px;">হাদিস নং ${hadith.hadith_number}</h3>
      <p style="font-size: 18px; line-height: 1.6; margin-bottom: 15px; direction: rtl; text-align: right;">
        ${hadith.text_arabic || hadith.arabic}
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        <strong>বাংলা:</strong> ${hadith.text_bangla || hadith.bangla}
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
        <strong>বর্ণনাকারী:</strong> ${hadith.narrator}
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        <strong>সূত্র:</strong> ${hadith.reference}
      </p>
    </div>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>আজকের হাদিস - আমার হাদিস</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10B981; margin-bottom: 10px;">আমার হাদিস</h1>
        <p style="color: #6b7280;">আজকের দৈনিক হাদিস</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>আসসালামু আলাইকুম ${userName},</p>
        <p>আজকের জন্য নির্বাচিত হাদিসগুলো নিচে দেওয়া হলো:</p>
      </div>
      
      ${hadithHtml}
      
      <div style="margin-top: 40px; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
        <p style="margin-bottom: 15px;">হাদিস পড়ার পর আমাদের ওয়েবসাইটে গিয়ে চিহ্নিত করুন</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">ওয়েবসাইট ভিজিট করুন</a>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>আমার হাদিস - প্রতিদিন ইসলামী জ্ঞান অর্জন করুন</p>
        <p>এই ইমেইল পেতে না চাইলে <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">আনসাবস্ক্রাইব</a> করুন</p>
      </div>
    </body>
    </html>
  `

  const text = `
আসসালামু আলাইকুম ${userName},

আজকের জন্য নির্বাচিত হাদিসগুলো:

${hadithList.map((hadith, index) => `
${index + 1}. হাদিস নং ${hadith.hadith_number}
আরবি: ${hadith.text_arabic || hadith.arabic}
বাংলা: ${hadith.text_bangla || hadith.bangla}
বর্ণনাকারী: ${hadith.narrator}
সূত্র: ${hadith.reference}
`).join('\n')}

হাদিস পড়ার পর আমাদের ওয়েবসাইটে গিয়ে চিহ্নিত করুন: ${process.env.NEXT_PUBLIC_APP_URL}

আমার হাদিস - প্রতিদিন ইসলামী জ্ঞান অর্জন করুন
  `

  return {
    subject: `আজকের হাদিস - ${new Date().toLocaleDateString('bn-BD')}`,
    html,
    text
  }
}

// Create achievement notification template
export const createAchievementEmailTemplate = (
  userName: string,
  achievement: any
): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>নতুন অর্জন - আমার হাদিস</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10B981; margin-bottom: 10px;">🎉 অভিনন্দন!</h1>
        <p style="color: #6b7280;">আপনি একটি নতুন অর্জন আনলক করেছেন</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #10B981, #3B82F6); border-radius: 12px; color: white;">
        <div style="font-size: 48px; margin-bottom: 15px;">${achievement.icon}</div>
        <h2 style="margin-bottom: 10px; color: white;">${achievement.name_bangla}</h2>
        <p style="margin-bottom: 15px; opacity: 0.9;">${achievement.description_bangla}</p>
        <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block;">
          ⭐ ${achievement.points_reward} পয়েন্ট অর্জিত
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>প্রিয় ${userName},</p>
        <p>আপনার ইসলামী জ্ঞান অর্জনের যাত্রায় এই মাইলফলক অর্জনের জন্য অভিনন্দন! আপনার নিয়মিত হাদিস পড়ার অভ্যাস সত্যিই প্রশংসনীয়।</p>
      </div>
      
      <div style="margin-top: 40px; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
        <p style="margin-bottom: 15px;">আরও অর্জন দেখুন এবং আপনার অগ্রগতি ট্র্যাক করুন</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/achievements" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">অর্জনসমূহ দেখুন</a>
      </div>
    </body>
    </html>
  `

  const text = `
🎉 অভিনন্দন ${userName}!

আপনি একটি নতুন অর্জন আনলক করেছেন:

${achievement.icon} ${achievement.name_bangla}
${achievement.description_bangla}
⭐ ${achievement.points_reward} পয়েন্ট অর্জিত

আপনার ইসলামী জ্ঞান অর্জনের যাত্রায় এই মাইলফলক অর্জনের জন্য অভিনন্দন!

আরও অর্জন দেখুন: ${process.env.NEXT_PUBLIC_APP_URL}/achievements
  `

  return {
    subject: `🎉 নতুন অর্জন: ${achievement.name_bangla}`,
    html,
    text
  }
}

// Create prayer reminder template
export const createPrayerReminderTemplate = (
  userName: string,
  prayerName: string,
  prayerTime: string
): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>নামাজের সময় - আমার হাদিস</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10B981; margin-bottom: 10px;">🕌 নামাজের সময়</h1>
        <p style="color: #6b7280;">${prayerName} নামাজের সময় হয়েছে</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #10B981, #3B82F6); border-radius: 12px; color: white;">
        <div style="font-size: 48px; margin-bottom: 15px;">🕌</div>
        <h2 style="margin-bottom: 10px; color: white;">${prayerName}</h2>
        <p style="margin-bottom: 0; font-size: 18px; opacity: 0.9;">সময়: ${prayerTime}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>প্রিয় ${userName},</p>
        <p>${prayerName} নামাজের সময় হয়েছে। আল্লাহর সাথে সংযোগ স্থাপনের এই পবিত্র মুহূর্তটি হাতছাড়া করবেন না।</p>
      </div>
      
      <div style="margin-top: 40px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
        <p style="margin-bottom: 10px; font-weight: bold;">নামাজের ফজিলত:</p>
        <p style="margin-bottom: 0; font-style: italic;">"নিশ্চয়ই নামাজ মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ।" - সূরা নিসা: ১০৩</p>
      </div>
    </body>
    </html>
  `

  const text = `
🕌 নামাজের সময়

প্রিয় ${userName},

${prayerName} নামাজের সময় হয়েছে (${prayerTime})।

আল্লাহর সাথে সংযোগ স্থাপনের এই পবিত্র মুহূর্তটি হাতছাড়া করবেন না।

"নিশ্চয়ই নামাজ মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ।" - সূরা নিসা: ১০৩
  `

  return {
    subject: `🕌 ${prayerName} নামাজের সময়`,
    html,
    text
  }
}

// Send daily hadith emails to all subscribed users
export const sendDailyHadithEmails = async () => {
  try {
    // Get all users who want daily emails
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, email_notifications')
      .eq('email_notifications', true)

    if (usersError || !users) {
      console.error('Error fetching users:', usersError)
      return
    }

    // Get today's hadith
    const { getDailyHadith } = await import('./supabase')
    const { data: hadithList, error: hadithError } = await getDailyHadith()

    if (hadithError || !hadithList) {
      console.error('Error fetching daily hadith:', hadithError)
      return
    }

    // Send emails to all users
    for (const user of users) {
      const template = createDailyHadithEmailTemplate(
        user.full_name || 'ব্যবহারকারী',
        hadithList
      )

      await sendEmailNotification(user.email, template)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`Daily hadith emails sent to ${users.length} users`)
  } catch (error) {
    console.error('Error sending daily hadith emails:', error)
  }
}

// Schedule notifications (this would typically run as a cron job)
export const scheduleNotifications = () => {
  // Send daily hadith emails at 6 AM
  const sendDailyEmails = () => {
    const now = new Date()
    if (now.getHours() === 6 && now.getMinutes() === 0) {
      sendDailyHadithEmails()
    }
  }

  // Check every minute
  setInterval(sendDailyEmails, 60 * 1000)
}
