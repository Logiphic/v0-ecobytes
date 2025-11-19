import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { organization_id, items, type, slot_id, notes } = body

  // Validate required fields
  if (!organization_id || !items || !Array.isArray(items) || items.length === 0 || !type || !slot_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: donation, error: donationError } = await supabase
    .from('donations')
    .insert({
      user_id: user.id,
      organization_id,
      items,
      type,
      slot_id,
      status: 'pending',
      notes
    })
    .select()
    .single()

  if (donationError) {
    return NextResponse.json({ error: donationError.message }, { status: 500 })
  }

  // This happens in a separate API endpoint (donations/[id]/accept)

  return NextResponse.json(donation)
}
