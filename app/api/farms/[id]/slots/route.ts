import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const supabase = await createClient()
    
    let query = supabase
      .from('farm_slots')
      .select('*')
      .eq('farm_id', id)
      .eq('is_available', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .order('time')

    if (type) {
      query = query.eq('type', type)
    }

    const { data: slots, error } = await query

    if (error) throw error

    return NextResponse.json(slots)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
