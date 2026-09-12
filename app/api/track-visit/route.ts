import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shopSlug, sessionSlug, path, visitorId } = body

    if (!shopSlug || !path) {
      return NextResponse.json(
        { error: 'shopSlug et path requis' },
        { status: 400 }
      )
    }

    const admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Résoudre shop_id et session_id
    const { data: shop } = await admin
      .from('shops')
      .select('id')
      .eq('slug', shopSlug)
      .maybeSingle()

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    let sessionId: string | null = null
    if (sessionSlug) {
      const { data: session } = await admin
        .from('publication_sessions')
        .select('id')
        .eq('shop_id', shop.id)
        .eq('slug', sessionSlug)
        .maybeSingle()
      sessionId = session?.id ?? null
    }

    // IP hashée (anonymisée)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0] || 'unknown'
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 16)

    await admin.from('shop_visits').insert({
      shop_id: shop.id,
      session_id: sessionId,
      path,
      referrer: request.headers.get('referer') || null,
      user_agent: request.headers.get('user-agent') || null,
      ip_hash: ipHash,
      visitor_id: visitorId || null,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('track-visit error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}