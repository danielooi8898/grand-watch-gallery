import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function getProductInfo() {
  try {
    const { data } = await supabase.from('watches').select('*').limit(100)
    return data || []
  } catch {
    return []
  }
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if API key is set
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY not set in environment')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Get product catalog for context
    const products = await getProductInfo()
    const productSummary = products && products.length > 0
      ? products.map(p => `- ${p.brand} ${p.model} (Ref: ${p.reference}) - ${p.condition} - MYR ${p.price}`).join('\n')
      : 'Various luxury watches available'

    const systemPrompt = `You are a friendly and helpful customer service assistant for Grand Watch Gallery (GWG), a luxury watch retailer in Malaysia.

COMPANY INFO:
- Name: Grand Watch Gallery (GWG)
- Location: Lot G19, Ground Floor, Atria Shopping Gallery, Jalan SS 22/23, Damansara Jaya, Petaling Jaya
- Website: grandwatchgallery.my
- Phone: +603 89966788
- Email: info@grandwatchgallery.my
- Description: Malaysia's Most Trusted and Well-known luxury watch reseller. We offer Brand New and authenticated pre-owned watches.

CURRENT PRODUCT CATALOG:
${productSummary || 'Various luxury watches available including Rolex, Patek Philippe, Audemars Piguet, Tudor, Omega, and more.'}

YOUR ROLE:
- Help customers find watches based on their preferences (brand, budget, condition, features)
- Answer questions about specific watches in our inventory
- Provide information about the company, location, and contact details
- Give recommendations based on customer needs
- Be friendly, professional, and helpful
- If you don't have specific information, suggest they contact us directly

TONE: Friendly, professional, and knowledgeable about luxury watches.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Claude API error:', response.status, data)
      return NextResponse.json(
        { error: `API Error: ${data.error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      console.error('Invalid API response:', data)
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }

    const reply = data.content[0]?.text || 'Unable to process response'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error.message || error)
    return NextResponse.json(
      { error: `Error: ${error.message || 'Failed to process message'}` },
      { status: 500 }
    )
  }
}
