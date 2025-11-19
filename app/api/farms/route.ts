import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: farms, error } = await supabase
      .from('farms')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(farms)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
