import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function getProducts() {
  try {
    const { data } = await supabase.from('watches').select('*').limit(100)
    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Get products for context
    const products = await getProducts()
    const productList = products.length > 0
      ? products.map(p => `${p.brand} ${p.model} (${p.reference}) - ${p.condition} - MYR ${p.price || 'Contact'}`).join('\n')
      : 'Rolex, Patek Philippe, Audemars Piguet, Tudor, Omega, Cartier, and Richard Mille'

    const systemPrompt = `You are a friendly and knowledgeable customer service assistant for Grand Watch Gallery (GWG), Malaysia's most trusted luxury watch reseller.

COMPANY INFO:
- Location: Lot G19, Ground Floor, Atria Shopping Gallery, Jalan SS 22/23, Damansara Jaya, Petaling Jaya
- Phone: +603 89966788
- Email: info@grandwatchgallery.my
- Website: grandwatchgallery.my

OUR INVENTORY:
${productList}

You provide helpful, personalized recommendations based on customer preferences. You're knowledgeable about luxury watches, their features, conditions, and value. Be conversational, friendly, and professional. Always provide the company's contact details when appropriate.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, data)
      return NextResponse.json(
        { error: `API Error: ${data.error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    const reply = data.choices?.[0]?.message?.content || 'Unable to process response'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error.message || error)
    return NextResponse.json(
      { error: `Error: ${error.message || 'Failed to process message'}` },
      { status: 500 }
    )
  }
}
