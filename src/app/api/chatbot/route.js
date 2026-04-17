import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function getCompanyInfo() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Database error fetching company info:', error)
      return {}
    }

    console.log('Company info fetched:', data)
    return data || {}
  } catch (error) {
    console.error('Error in getCompanyInfo:', error)
    return {}
  }
}

async function getProducts() {
  try {
    const { data } = await supabase.from('watches').select('*').limit(200)
    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return null
  const num = parseInt(priceStr.toString().replace(/[^0-9]/g, ''))
  return isNaN(num) ? null : num
}

function filterProducts(products, query) {
  const queryLower = query.toLowerCase()

  // Extract keywords
  const brandKeywords = ['rolex', 'patek', 'philippe', 'audemars', 'piguet', 'omega', 'tudor', 'cartier', 'richard', 'mille']
  const conditionKeywords = ['new', 'excellent', 'good', 'pre-owned', 'unworn']
  const priceKeywords = ['under', 'below', 'cheap', 'budget', 'expensive', 'luxury', '50k', '100k', 'affordable']

  let filtered = products

  // Filter by brand
  const brandMatch = brandKeywords.find(b => queryLower.includes(b))
  if (brandMatch) {
    filtered = filtered.filter(p => p.brand && p.brand.toLowerCase().includes(brandMatch))
  }

  // Filter by model/reference
  if (queryLower.includes('model') || queryLower.includes('reference')) {
    const modelMatch = products.find(p => p.model && p.model.toLowerCase().includes(queryLower.replace('model', '').replace('reference', '').trim()))
    if (modelMatch) {
      filtered = filtered.filter(p => p.model && p.model.toLowerCase().includes(modelMatch.model.toLowerCase()))
    }
  }

  // Filter by condition
  const conditionMatch = conditionKeywords.find(c => queryLower.includes(c))
  if (conditionMatch) {
    filtered = filtered.filter(p => p.condition && p.condition.toLowerCase().includes(conditionMatch))
  }

  // Filter by price range
  if (queryLower.includes('under') || queryLower.includes('budget') || queryLower.includes('cheap')) {
    const num = parseInt(queryLower.match(/\d+/)?.[0] || '50')
    filtered = filtered.filter(p => {
      const price = parsePrice(p.price)
      return price && price <= num * 1000
    })
  }

  // If no specific filters, return top matches by brand/model
  if (filtered.length === 0) {
    filtered = products.filter(p =>
      (p.brand && p.brand.toLowerCase().includes(queryLower)) ||
      (p.model && p.model.toLowerCase().includes(queryLower)) ||
      (p.reference && p.reference.toLowerCase().includes(queryLower))
    )
  }

  return filtered.slice(0, 8)
}

function generateResponse(message, products, companyInfo) {
  const queryLower = message.toLowerCase().trim()

  // Helper to get company info - look for multiple possible field names
  const getInfo = (field) => {
    return companyInfo[field] || companyInfo[field.toLowerCase()] || 'Contact us for details'
  }

  // Greetings
  if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'].some(g => queryLower === g || queryLower.startsWith(g + ' '))) {
    return `Hello! 👋 Welcome to Grand Watch Gallery. I can help you find luxury watches or answer questions about our store. What are you looking for today?`
  }

  // Hours
  if (queryLower.includes('hours') || queryLower.includes('opening') || queryLower.includes('time') || queryLower.includes('open') || queryLower.includes('closed')) {
    const hours = getInfo('hours')
    const phone = getInfo('phone')
    return `⏰ Opening Hours:\n\n${hours}\n\nPhone: ${phone}`
  }

  // WhatsApp
  if (queryLower.includes('whatsapp') || queryLower.includes('wechat')) {
    const whatsapp = getInfo('whatsapp')
    return `💬 WhatsApp:\n\n${whatsapp}`
  }

  // Phone
  if (queryLower.includes('phone') && !queryLower.includes('contact')) {
    const phone = getInfo('phone')
    return `📞 Phone: ${phone}`
  }

  // Email
  if (queryLower.includes('email')) {
    const email = getInfo('email')
    return `📧 Email: ${email}`
  }

  // Contact
  if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('call')) {
    const phone = getInfo('phone')
    const whatsapp = getInfo('whatsapp')
    const email = getInfo('email')
    return `📞 Contact Grand Watch Gallery:\n\nPhone: ${phone}\nWhatsApp: ${whatsapp}\nEmail: ${email}`
  }

  // Location/Address
  if (queryLower.includes('location') || queryLower.includes('address') || queryLower.includes('where') || queryLower.includes('visit')) {
    const address = getInfo('address')
    const phone = getInfo('phone')
    const hours = getInfo('hours')
    return `📍 Visit Us:\n\n${address}\n\nPhone: ${phone}\nHours: ${hours}`
  }

  if (queryLower.includes('about') || queryLower.includes('who are you') || queryLower.includes('company')) {
    const heading = getInfo('about_heading')
    const body = getInfo('about_body')
    const phone = getInfo('phone')
    const email = getInfo('email')
    return `${heading}\n\n${body}\n\nPhone: ${phone}\nEmail: ${email}`
  }

  if (queryLower.includes('appointment') || queryLower.includes('book') || queryLower.includes('viewing') || queryLower.includes('schedule')) {
    const phone = getInfo('phone')
    const whatsapp = getInfo('whatsapp')
    const email = getInfo('email')
    return `Book a Private Viewing:\n\nCall us to schedule your personalized appointment.\n\nPhone: ${phone}\nWhatsApp: ${whatsapp}\nEmail: ${email}\n\nWe offer a premium, one-on-one experience with no pressure.`
  }

  if (queryLower.includes('brand') || queryLower.includes('carry') || queryLower.includes('sell')) {
    const brands = companyInfo?.brands
    let brandsText = 'Check our collection'
    if (brands && Array.isArray(brands)) {
      brandsText = brands.map(b => `• ${b}`).join('\n')
    }
    const phone = getInfo('phone')
    return `Our Brands:\n\n${brandsText}\n\nCall ${phone} for more details`
  }

  // Product search
  const matchedProducts = filterProducts(products, message)

  if (matchedProducts.length > 0) {
    let response = 'Found Watches:\n\n'
    matchedProducts.forEach(p => {
      const price = p.price ? `MYR ${p.price}` : 'Contact for price'
      response += `${p.brand} ${p.model}\nReference: ${p.reference}\nCondition: ${p.condition}\nPrice: ${price}\n\n`
    })
    response += `For details, call ${COMPANY_INFO.phone}`
    return response
  }

  // Default response
  return `I can help you with:\n\n• Searching by brand (Rolex, Patek Philippe, Omega, etc.)\n• Price range inquiries (e.g., "under 50k")\n• Watch condition details\n• Booking appointments\n• Contact information\n\nWhat would you like to know?`
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const products = await getProducts()
    const companyInfo = await getCompanyInfo()
    const reply = generateResponse(message, products, companyInfo)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
