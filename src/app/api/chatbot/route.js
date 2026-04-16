import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Company info
const COMPANY_INFO = {
  name: 'Grand Watch Gallery (GWG)',
  location: 'Lot G19, Ground Floor, Atria Shopping Gallery, Jalan SS 22/23, Damansara Jaya, Petaling Jaya',
  website: 'grandwatchgallery.my',
  phone: '+603 89966788',
  email: 'info@grandwatchgallery.my',
  description: "Malaysia's Most Trusted and Well-known luxury watch reseller"
}

async function getProducts() {
  try {
    const { data } = await supabase.from('watches').select('*').limit(100)
    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

function findMatchingProducts(query, products) {
  const queryLower = query.toLowerCase()
  return products.filter(p =>
    (p.brand && p.brand.toLowerCase().includes(queryLower)) ||
    (p.model && p.model.toLowerCase().includes(queryLower)) ||
    (p.reference && p.reference.toLowerCase().includes(queryLower))
  ).slice(0, 5)
}

function generateResponse(message, products) {
  const lowerMessage = message.toLowerCase()

  // Company info responses
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return `📞 **Contact Us:**\n\n📱 Phone: ${COMPANY_INFO.phone}\n📧 Email: ${COMPANY_INFO.email}\n📍 Location: ${COMPANY_INFO.location}`
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return `📍 **Our Location:**\n\n${COMPANY_INFO.location}`
  }

  if (lowerMessage.includes('about') || lowerMessage.includes('who are you')) {
    return `ℹ️ **About Grand Watch Gallery:**\n\n${COMPANY_INFO.description}. We offer Brand New and authenticated pre-owned watches from premium brands.`
  }

  if (lowerMessage.includes('brand') || lowerMessage.includes('carry')) {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
    return `⌚ **Our Brands:**\n\n${brands.map(b => `✓ ${b}`).join('\n')}`
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('viewing')) {
    return `📅 **Book an Appointment:**\n\nVisit our website or call ${COMPANY_INFO.phone} to schedule a private viewing. We offer a personalized, one-on-one experience.`
  }

  // Product search
  const matchedProducts = findMatchingProducts(message, products)
  if (matchedProducts.length > 0) {
    let response = '⌚ **Found Watches:**\n\n'
    matchedProducts.forEach(p => {
      response += `• **${p.brand} ${p.model}**\n  Ref: ${p.reference}\n  Condition: ${p.condition}\n  Price: ${p.price ? `MYR ${p.price}` : 'Contact us'}\n\n`
    })
    response += `\n📞 For more details, call ${COMPANY_INFO.phone}`
    return response
  }

  // Default response
  return `Thanks for your message! 😊 We have a wide selection of luxury watches. Try asking about:\n\n• Specific brands (Rolex, Patek Philippe, Omega, etc.)\n• Our location\n• How to book an appointment\n• Contact information\n\n📞 Or call us directly: ${COMPANY_INFO.phone}`
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get all products
    const products = await getProducts()

    // Generate response based on database
    const reply = generateResponse(message, products)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error.message || error)
    return NextResponse.json(
      { error: `Error: ${error.message || 'Failed to process message'}` },
      { status: 500 }
    )
  }
}
