import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendEmailFallback } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json()

    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Try to send welcome email, fallback if service unavailable
    let result
    try {
      result = await sendWelcomeEmail(userEmail, userName)
    } catch (emailError) {
      console.warn('Primary email service failed, using fallback:', emailError)
      result = await sendEmailFallback({
        to: userEmail,
        subject: 'আমার হাদিসে স্বাগতম! 🌟',
        html: `<h1>স্বাগতম ${userName}!</h1><p>আমার হাদিস পরিবারে আপনাকে স্বাগতম।</p>`
      })
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in welcome email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
