import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

// Send welcome email to new users
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'আমার হাদিস <noreply@yourdomain.com>',
      to: userEmail,
      subject: 'আমার হাদিসে স্বাগতম! 🕌',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🕌 আমার হাদিস</h1>
            <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 16px;">দৈনিক হাদিস অধ্যয়ন</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #10B981; margin-top: 0;">আসসালামু আলাইকুম ${userName}!</h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              আমার হাদিস পরিবারে আপনাকে স্বাগতম! আপনি এখন প্রতিদিন ৩টি করে নির্বাচিত হাদিস পাবেন যা আপনার ইসলামী জ্ঞান বৃদ্ধিতে সহায়ক হবে।
            </p>
            
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
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}" 
                 style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                আজই শুরু করুন
              </a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
              আল্লাহ আপনাকে উত্তম প্রতিদান দিন। বারাকাল্লাহু ফিকুম।
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ২০২৪ আমার হাদিস। সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      `,
      text: `আসসালামু আলাইকুম ${userName}! আমার হাদিসে স্বাগতম। আপনি এখন প্রতিদিন ৩টি করে নির্বাচিত হাদিস পাবেন।`
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

// Send daily hadith email
export async function sendDailyHadithEmail(
  userEmail: string, 
  userName: string, 
  hadithList: any[]
) {
  try {
    const hadithHtml = hadithList.map((hadith, index) => `
      <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="color: #10B981; margin: 0; font-size: 18px;">হাদিস ${index + 1}</h3>
          <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">${hadith.book?.name_bangla || hadith.source} • ${hadith.hadith_number}</p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #fefce8; border-radius: 8px; margin-bottom: 15px;">
          <p style="font-size: 20px; line-height: 1.8; color: #1f2937; font-family: 'Times New Roman', serif; direction: rtl;">
            ${hadith.text_arabic || hadith.arabic}
          </p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.7; color: #374151; margin: 0;">
            ${hadith.text_bangla || hadith.bangla}
          </p>
        </div>
        
        ${hadith.narrator ? `
          <div style="margin-top: 15px; padding: 10px; background: #f9fafb; border-radius: 6px;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              <strong>বর্ণনাকারী:</strong> ${hadith.narrator}
            </p>
          </div>
        ` : ''}
      </div>
    `).join('')

    const { data, error } = await resend.emails.send({
      from: 'আমার হাদিস <noreply@yourdomain.com>',
      to: userEmail,
      subject: `আজকের হাদিস - ${new Date().toLocaleDateString('bn-BD')} 📚`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🕌 আজকের হাদিস</h1>
            <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 16px;">
              ${new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; margin: 0;">আসসালামু আলাইকুম ${userName},</p>
            <p style="color: #6B7280; font-size: 14px; margin: 5px 0 0 0;">আজকের জন্য নির্বাচিত হাদিসগুলি:</p>
          </div>
          
          ${hadithHtml}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}" 
               style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              পঠিত হিসেবে চিহ্নিত করুন
            </a>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center; margin-top: 25px;">
            <p style="color: #374151; margin: 0; font-size: 14px;">
              "যে ব্যক্তি জ্ঞানের সন্ধানে বের হয়, সে আল্লাহর পথে থাকে।" - তিরমিযী
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ২০২৪ আমার হাদিস। সকল অধিকার সংরক্ষিত।</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="color: #10B981;">সেটিংস</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #10B981;">আনসাবস্ক্রাইব</a>
            </p>
          </div>
        </div>
      `,
      text: `আসসালামু আলাইকুম ${userName}! আজকের হাদিস: ${hadithList.map(h => h.text_bangla || h.bangla).join(' | ')}`
    })

    if (error) {
      console.error('Error sending daily hadith email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending daily hadith email:', error)
    return { success: false, error }
  }
}

// Send prayer reminder email
export async function sendPrayerReminderEmail(
  userEmail: string,
  userName: string,
  prayerName: string,
  prayerTime: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'আমার হাদিস <noreply@yourdomain.com>',
      to: userEmail,
      subject: `${prayerName} নামাজের সময় 🕌`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 25px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🕌 নামাজের সময়</h1>
            <h2 style="color: #f0f9ff; margin: 15px 0 0 0; font-size: 28px;">${prayerName}</h2>
            <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 18px;">${prayerTime}</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin-top: 20px; text-align: center;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 15px 0;">আসসালামু আলাইকুম ${userName},</p>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              ${prayerName} নামাজের সময় হয়েছে। আল্লাহ আপনাকে তাওফিক দিন।
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ২০২৪ আমার হাদিস</p>
          </div>
        </div>
      `,
      text: `আসসালামু আলাইকুম ${userName}! ${prayerName} নামাজের সময় হয়েছে (${prayerTime})।`
    })

    if (error) {
      console.error('Error sending prayer reminder email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending prayer reminder email:', error)
    return { success: false, error }
  }
}

// Send weekly summary email
export async function sendWeeklySummaryEmail(
  userEmail: string,
  userName: string,
  weeklyStats: any
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'আমার হাদিস <noreply@yourdomain.com>',
      to: userEmail,
      subject: 'আপনার সাপ্তাহিক অগ্রগতি 📊',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📊 সাপ্তাহিক সামারি</h1>
            <p style="color: #f0f9ff; margin: 10px 0 0 0; font-size: 16px;">আপনার অগ্রগতি</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">আসসালামু আলাইকুম ${userName},</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center;">
                <h3 style="color: #10B981; margin: 0; font-size: 24px;">${weeklyStats.totalHadithRead}</h3>
                <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">মোট পঠিত</p>
              </div>
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
                <h3 style="color: #f59e0b; margin: 0; font-size: 24px;">${weeklyStats.streakDays}</h3>
                <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">ধারা দিন</p>
              </div>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; text-align: center;">
              চমৎকার! এভাবেই চালিয়ে যান। আল্লাহ আপনাকে উত্তম প্রতিদান দিন।
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ২০২৪ আমার হাদিস</p>
          </div>
        </div>
      `,
      text: `আসসালামু আলাইকুম ${userName}! এই সপ্তাহে আপনি ${weeklyStats.totalHadithRead}টি হাদিস পড়েছেন।`
    })

    if (error) {
      console.error('Error sending weekly summary email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending weekly summary email:', error)
    return { success: false, error }
  }
}
