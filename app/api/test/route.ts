import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data: books, error: booksError } = await supabase
      .from('hadith_books')
      .select('id, name_bangla')
      .limit(5)

    const { data: categories, error: categoriesError } = await supabase
      .from('hadith_categories')
      .select('id, name_bangla')
      .limit(5)

    const { data: hadith, error: hadithError } = await supabase
      .from('hadith')
      .select('id, text_bangla')
      .limit(3)

    return NextResponse.json({
      status: 'success',
      message: 'API is working!',
      data: {
        books: {
          count: books?.length || 0,
          data: books || [],
          error: booksError?.message || null
        },
        categories: {
          count: categories?.length || 0,
          data: categories || [],
          error: categoriesError?.message || null
        },
        hadith: {
          count: hadith?.length || 0,
          data: hadith || [],
          error: hadithError?.message || null
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API Test Error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
