import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { farm_id, items, type, slot_id, notes } = body

    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: compostingLog, error: compostError } = await supabase
      .from('composting_logs')
      .insert({
        user_id: user.id,
        farm_id,
        items,
        type,
        slot_id,
        composting_date: new Date().toISOString().split('T')[0],
        notes,
        status: 'pending',
        quantity: items.reduce((sum: number, item: any) => sum + parseFloat(item.quantity), 0)
      })
      .select()
      .single()

    if (compostError) throw compostError


    return NextResponse.json(compostingLog)
  } catch (error: any) {
    console.error('Error creating composting request:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
