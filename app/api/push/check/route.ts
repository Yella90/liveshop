import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ registered: false }, { status: 200 })
    }

    const { endpoint } = await req.json()

    if (!endpoint) {
      return NextResponse.json({ registered: false }, { status: 200 })
    }

    // RLS filtre déjà par user_id
    const { data } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({ registered: !!data })
  } catch {
    return NextResponse.json({ registered: false }, { status: 200 })
  }
}