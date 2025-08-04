import { NextRequest, NextResponse } from 'next/server'
import { sendDailyHadithEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, hadithList } = await request.json()

    if (!userEmail || !userName || !hadithList) {
      return NextResponse.json(
        { error: 'Email, name, and hadith list are required' },
        { status: 400 }
      )
    }

    const result = await sendDailyHadithEmail(userEmail, userName, hadithList)

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
