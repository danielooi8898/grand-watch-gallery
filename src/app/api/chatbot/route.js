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
    const { data } = await supabase.from('inventory').select('*').limit(200)
    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

async function getInventoryStats() {
  try {
    const { data: inventory } = await supabase.from('inventory').select('*')
    const { data: customers } = await supabase.from('customers').select('*')
    const { data: orders } = await supabase.from('orders').select('*')

    return {
      inventory: inventory || [],
      customers: customers || [],
      orders: orders || [],
      totalItems: (inventory || []).length,
      activeItems: (inventory || []).filter(i => i.status === 'Active').length,
      soldItems: (inventory || []).filter(i => i.status === 'Sold').length,
    }
  } catch (error) {
    console.error('Database error:', error)
    return { inventory: [], customers: [], orders: [], totalItems: 0, activeItems: 0, soldItems: 0 }
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

function generateResponse(message, products, companyInfo, stats) {
  const queryLower = message.toLowerCase().trim()

  // Greetings
  if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'].some(g => queryLower === g || queryLower.startsWith(g + ' '))) {
    return `Welcome to Grand Watch Gallery

We are Malaysia's premier luxury watch reseller, specializing in authenticated timepieces from the world's most prestigious brands.

How can we assist you today? Please select from the menu options to explore our services.`
  }

  // Hours
  if (queryLower.includes('hours') || queryLower.includes('opening') || queryLower.includes('time') || queryLower.includes('open') || queryLower.includes('closed')) {
    return `Opening Hours

${companyInfo.hours}

For additional inquiries, please contact us at ${companyInfo.phone}`
  }

  // WhatsApp
  if (queryLower.includes('whatsapp') || queryLower.includes('wechat')) {
    return `WhatsApp Contact

${companyInfo.whatsapp}

This number is available for inquiries and appointment scheduling via WhatsApp.`
  }

  // Phone
  if (queryLower.includes('phone') && !queryLower.includes('contact')) {
    return `Phone Numbers

Primary: ${companyInfo.phone}
Secondary: ${companyInfo.phone2}

Both numbers are available for your inquiries and appointment scheduling.`
  }

  // Email
  if (queryLower.includes('email')) {
    return `Email Address

${companyInfo.email}

Please allow 24 hours for response to email inquiries. For urgent matters, please call our primary number.`
  }

  // Contact
  if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('call')) {
    return `Contact Information

Telephone:
Primary: ${companyInfo.phone}
Secondary: ${companyInfo.phone2}

WhatsApp: ${companyInfo.whatsapp}

Email: ${companyInfo.email}

Our team is ready to assist you with any inquiries about our services and collection.`
  }

  // Location/Address
  if (queryLower.includes('location') || queryLower.includes('address') || queryLower.includes('where') || queryLower.includes('visit')) {
    return `Location & Hours

Address:
${companyInfo.address}

Opening Hours:
${companyInfo.hours}

Contact: ${companyInfo.phone}

Visit us during business hours for a personalized consultation with our experts.`
  }

  // About
  if (queryLower.includes('about') || queryLower.includes('who are you') || queryLower.includes('company')) {
    return `About Grand Watch Gallery

${companyInfo.about}

We are committed to providing transparency, trust, and expertise in the luxury watch market. Our team of professionals ensures every timepiece in our collection meets the highest standards of authenticity and quality.

For more information, contact us:
Email: ${companyInfo.email}
Phone: ${companyInfo.phone}`
  }

  // Appointment/Booking
  if (queryLower.includes('appointment') || queryLower.includes('book') || queryLower.includes('viewing') || queryLower.includes('schedule')) {
    return `Private Viewing Appointment

Experience our carefully curated collection of luxury watches in a personalized, one-on-one consultation with our expert team.

Booking Details:
Duration: 30-60 minutes
Location: Lot G31, Ground Floor, Atria Shopping Gallery
Cost: Complimentary, no pressure

To Schedule Your Appointment:

Telephone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}

We recommend booking in advance to ensure availability.`
  }

  // Menu options - Services
  if (queryLower === 'authenticated') {
    return `Every Watch Authenticated

Each timepiece in our collection undergoes rigorous inspection by our in-house team of expert horologists.

What We Verify:
- Serial numbers and production records
- Movement authenticity and functionality
- Dial and case condition
- All original components

Our thorough authentication process ensures you purchase with complete confidence in the authenticity and quality of your investment.

For more details about our authentication process, contact us:
Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}`
  }

  if (queryLower === 'tradein') {
    return `Trade-In at Fair Value

Looking to upgrade your collection? We offer competitive and transparent valuations for pre-owned luxury watches.

Our Commitment:
- Fair market valuations
- Transparent pricing process
- No haggling required
- No hidden surprises
- Expert assessment

We understand the value of your timepiece and provide honest, professional evaluations.

To discuss a trade-in or receive a valuation:
Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}`
  }

  if (queryLower === 'viewing') {
    return `Private Gallery Viewings

Explore our curated collection in a personalized, one-on-one environment with our expert consultants.

What to Expect:
- Exclusive appointment with a specialist
- In-depth discussion of timepieces
- Detailed explanation of each watch's features
- Comfortable, pressure-free experience
- Refreshments provided

To schedule your private viewing:
Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}

By appointment only`
  }

  // Company info options
  if (queryLower === 'about') {
    return `About Grand Watch Gallery

${companyInfo.about}

Our Mission

We are dedicated to providing transparency, trust, and expertise to the secondary luxury watch market. Each member of our team brings years of experience and genuine passion for fine timepieces.

What Sets Us Apart

- Authenticated collection of premium brands
- Expert team of watch specialists
- Transparent pricing and valuations
- Personalized consultation services
- Fair trade-in programs

For inquiries:
Email: ${companyInfo.email}
Phone: ${companyInfo.phone}`
  }

  if (queryLower === 'location') {
    return `Location & Hours

Address:
${companyInfo.address}

Opening Hours:
${companyInfo.hours}

Directions & Contact:
Phone: ${companyInfo.phone}

We welcome you to visit our showroom for an in-person consultation with our team.

For directions or additional information, please call us or check your preferred mapping application.`
  }

  if (queryLower === 'brands') {
    const brandsText = companyInfo.brands.map(b => `- ${b}`).join('\n')
    return `Our Luxury Watch Brands

We curate an exclusive selection of timepieces from the world's most prestigious watch manufacturers:

${brandsText}

Each brand in our collection represents the pinnacle of horological craftsmanship and precision engineering.

To inquire about specific brands or models:
Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}`
  }

  if (queryLower === 'services') {
    return `Our Services

We offer three core services to serve the luxury watch community:

1. Every Watch Authenticated
   Rigorous inspection and verification by expert horologists

2. Trade-In at Fair Value
   Competitive valuations for pre-owned watches

3. Private Gallery Viewings
   Personalized one-on-one consultations in our showroom

Select any service from the menu to learn more about how we can assist you.`
  }

  // Booking options
  if (queryLower === 'schedule') {
    return `Schedule a Private Viewing

Book your exclusive appointment to experience our collection with our expert team.

Appointment Details:
Duration: 30-60 minutes
Location: Grand Watch Gallery
Cost: Complimentary

To Reserve Your Appointment:

Telephone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}

Please provide your preferred dates and times. We recommend scheduling at least 24 hours in advance to ensure availability.`
  }

  if (queryLower === 'faq') {
    return `Appointment Frequently Asked Questions

Q: Is an appointment required to visit?
A: Yes, appointments ensure you receive personalized attention from our specialist team.

Q: How long does an appointment take?
A: Typically 30-60 minutes, depending on your interests and questions.

Q: Can I view specific watch models?
A: Absolutely. Please inform us of your interests when booking. Our team will prepare for your consultation.

Q: Is there a cost for appointments?
A: No, all appointments are complimentary with no obligation to purchase.

Q: What should I bring?
A: Bring any information about timepieces you currently own or are interested in. This helps us serve you better.

To Book Your Appointment:

Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}`
  }

  // Inventory Status
  if (queryLower.includes('inventory') || queryLower.includes('stock status') || queryLower.includes('how many')) {
    return `Current Inventory Status

Total Items: ${stats.totalItems}
Active Items: ${stats.activeItems}
Sold Items: ${stats.soldItems}

We maintain a carefully curated selection of authenticated luxury watches. Our inventory is constantly updated with new acquisitions and sales.

Top Brands in Our Collection:
${companyInfo.brands.slice(0, 8).map(b => `- ${b}`).join('\n')}

To inquire about specific watches, models, or brands:

Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}`
  }

  // Brand searches
  if (queryLower === 'all-brands' || queryLower === 'rolex' || queryLower === 'patek' || queryLower === 'audemars' || queryLower === 'omega' || queryLower === 'hublot' || queryLower === 'cartier' || queryLower === 'tudor') {
    const brandMap = {
      'all-brands': null,
      'rolex': 'Rolex',
      'patek': 'Patek Philippe',
      'audemars': 'Audemars Piguet',
      'omega': 'Omega',
      'hublot': 'Hublot',
      'cartier': 'Cartier',
      'tudor': 'Tudor'
    }
    const searchBrand = brandMap[queryLower]
    const matchedProducts = searchBrand ? filterProducts(products, searchBrand) : products.slice(0, 8)

    if (matchedProducts.length > 0) {
      let response = `${searchBrand ? searchBrand : 'Available'} Watches\n\n`
      matchedProducts.forEach(p => {
        const price = p.sale_price ? `MYR ${p.sale_price}` : 'Please contact for pricing'
        const brand = p.brand || 'Watch'
        const model = p.model || 'Model'
        const refId = p.ref_id || 'Reference'
        const condition = p.condition || 'Condition'
        response += `${brand} ${model}\nRef: ${refId}\nCondition: ${condition}\nPrice: ${price}\nStatus: ${p.status}\n\n`
      })
      response += `---\n\nFor detailed information, additional inventory, or to schedule a viewing:\n\nPhone: ${companyInfo.phone}\nWhatsApp: ${companyInfo.whatsapp}\nEmail: ${companyInfo.email}`
      return response
    }
    return `No ${searchBrand} watches currently available at this time.\n\nPlease contact us to inquire about upcoming inventory or to request specific models:\n\nPhone: ${companyInfo.phone}\nWhatsApp: ${companyInfo.whatsapp}`
  }

  if (queryLower === 'price-filter') {
    return `Price Ranges

We offer luxury watches across various price points to suit different budgets:

- Under MYR 30,000
- MYR 30,000 - MYR 50,000
- MYR 50,000 - MYR 100,000
- MYR 100,000+

Share your preferred budget range, and our team will curate a selection that matches your requirements.

To discuss pricing and availability:

Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}
Email: ${companyInfo.email}`
  }

  // Product search (for free-form queries)
  const matchedProducts = filterProducts(products, message)

  if (matchedProducts.length > 0) {
    let response = `Available Watches\n\n`
    matchedProducts.forEach(p => {
      const price = p.price ? `MYR ${p.price}` : 'Please contact for pricing'
      response += `${p.brand} ${p.model}\nReference: ${p.reference}\nCondition: ${p.condition}\nPrice: ${price}\n\n`
    })
    response += `---\n\nFor more information about any of these timepieces:\n\nPhone: ${companyInfo.phone}\nWhatsApp: ${companyInfo.whatsapp}\nEmail: ${companyInfo.email}\n\nWe recommend scheduling a private viewing to examine our watches in detail.`
    return response
  }

  // Default response
  return `How Can We Assist You?

Grand Watch Gallery provides comprehensive services for luxury watch enthusiasts and collectors:

Services Available:
- Browse our curated collection of premium watches
- Learn about our authentication process
- Inquire about trade-in valuations
- Schedule a private viewing
- Get contact information and directions
- Review our appointment options

Please select from the menu options above to explore how we can serve you.

For immediate assistance:
Phone: ${companyInfo.phone}
WhatsApp: ${companyInfo.whatsapp}`
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const products = await getProducts()
    const stats = await getInventoryStats()
    const reply = generateResponse(message, products, COMPANY_INFO, stats)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
