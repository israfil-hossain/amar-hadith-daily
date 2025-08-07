import { NextRequest, NextResponse } from 'next/server'
import { sendDailyHadithEmail, sendEmailFallback } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, hadithList } = await request.json()

    if (!userEmail || !userName || !hadithList) {
      return NextResponse.json(
        { error: 'Email, name, and hadith list are required' },
        { status: 400 }
      )
    }

    // Try to send daily hadith email, fallback if service unavailable
    let result
    try {
      result = await sendDailyHadithEmail(userEmail, hadithList)
    } catch (emailError) {
      console.warn('Primary email service failed, using fallback:', emailError)
      result = await sendEmailFallback({
        to: userEmail,
        subject: `আজকের হাদিস - ${new Date().toLocaleDateString('bn-BD')}`,
        html: `<h1>আজকের হাদিস</h1><p>প্রিয় ${userName}, আজকের হাদিস পড়ুন।</p>`
      })
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send daily hadith email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in daily hadith email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
