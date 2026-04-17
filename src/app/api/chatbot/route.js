import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const COMPANY_INFO = {
  name: 'Grand Watch Gallery',
  phone: '+6016-966 6822',
  phone2: '+60102345100',
  whatsapp: '6016-224 1804',
  email: 'info@grandwatchgallery.com',
  address: 'Lot G31, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23\nDamansara Jaya, Petaling Jaya\n47400 Petaling Jaya, Selangor',
  hours: 'Mon: 11:00am – 6:00pm\nTues: 11:00am – 6:00pm\nWed: 11:00am – 6:00pm\nThurs: 11:00am – 6:00pm\nFri: 11:00am – 6:00pm\nSat: 11:00am – 6:00pm\nSunday: Closed',
  brands: [
    'Rolex',
    'Patek Philippe',
    'Audemars Piguet',
    'Richard Mille',
    'Vacheron Constantin',
    'A. Lange & Söhne',
    'IWC Schaffhausen',
    'Omega',
    'Hublot',
    'Panerai',
    'Breguet',
    'Cartier',
    'Chopard',
    'Tudor',
    'MB&F',
    'Jacob & Co'
  ],
  about: 'Grand Watch Gallery was founded in 2020 with a singular mission – to bring transparency, trust, and expertise to secondary luxury watch market in Malaysia.'
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

  // Greetings
  if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'].some(g => queryLower === g || queryLower.startsWith(g + ' '))) {
    return `Hello! 👋 Welcome to Grand Watch Gallery. I can help you find luxury watches or answer questions about our store. What are you looking for today?`
  }

  // Hours
  if (queryLower.includes('hours') || queryLower.includes('opening') || queryLower.includes('time') || queryLower.includes('open') || queryLower.includes('closed')) {
    return `⏰ Opening Hours:\n\n${companyInfo.hours}\n\nFor more info: ${companyInfo.phone}`
  }

  // WhatsApp
  if (queryLower.includes('whatsapp') || queryLower.includes('wechat')) {
    return `💬 WhatsApp:\n\n${companyInfo.whatsapp}`
  }

  // Phone
  if (queryLower.includes('phone') && !queryLower.includes('contact')) {
    return `📞 Phone Numbers:\n\nPrimary: ${companyInfo.phone}\nSecondary: ${companyInfo.phone2}`
  }

  // Email
  if (queryLower.includes('email')) {
    return `📧 Email:\n\n${companyInfo.email}`
  }

  // Contact
  if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('call')) {
    return `📞 Contact Grand Watch Gallery:\n\nPhone: ${companyInfo.phone}\nSecondary: ${companyInfo.phone2}\nWhatsApp: ${companyInfo.whatsapp}\nEmail: ${companyInfo.email}`
  }

  // Location/Address
  if (queryLower.includes('location') || queryLower.includes('address') || queryLower.includes('where') || queryLower.includes('visit')) {
    return `📍 Visit Us:\n\n${companyInfo.address}\n\nPhone: ${companyInfo.phone}\n\nHours:\n${companyInfo.hours}`
  }

  // About
  if (queryLower.includes('about') || queryLower.includes('who are you') || queryLower.includes('company')) {
    return `About Grand Watch Gallery:\n\n${companyInfo.about}\n\nContact: ${companyInfo.email}\nPhone: ${companyInfo.phone}`
  }

  // Appointment/Booking
  if (queryLower.includes('appointment') || queryLower.includes('book') || queryLower.includes('viewing') || queryLower.includes('schedule')) {
    return `Book a Private Viewing:\n\nExperience our collection one-on-one with an expert. Book an exclusive consultation at our gallery – by appointment only.\n\nPhone: ${companyInfo.phone}\nWhatsApp: ${companyInfo.whatsapp}\nEmail: ${companyInfo.email}\n\nWe offer a premium experience with no pressure.`
  }

  // Brands
  if (queryLower.includes('brand') || queryLower.includes('carry') || queryLower.includes('sell') || queryLower.includes('collection')) {
    const brandsText = companyInfo.brands.map(b => `• ${b}`).join('\n')
    return `Our Brands:\n\n${brandsText}\n\nCall ${companyInfo.phone} or WhatsApp ${companyInfo.whatsapp} for availability and pricing`
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
    const reply = generateResponse(message, products, COMPANY_INFO)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
