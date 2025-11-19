import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'pickup' or 'delivery'

  const supabase = await createClient()
  
  let query = supabase
    .from('organization_slots')
    .select('*')
    .eq('organization_id', id)
    .eq('is_available', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date')
    .order('time')

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
