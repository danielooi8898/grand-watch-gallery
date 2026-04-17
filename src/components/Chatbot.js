'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

const MAIN_MENU = [
  { id: 'browse', label: '🔍 Browse Watches' },
  { id: 'company', label: '📍 Company Info' },
  { id: 'booking', label: '📅 Book Appointment' },
  { id: 'contact', label: '📞 Contact Us' }
]

const SUBMENU = {
  browse: [
    { id: 'all-brands', label: 'All Brands' },
    { id: 'rolex', label: 'Rolex Watches' },
    { id: 'patek', label: 'Patek Philippe' },
    { id: 'audemars', label: 'Audemars Piguet' },
    { id: 'omega', label: 'Omega' },
    { id: 'tudor', label: 'Tudor' },
    { id: 'cartier', label: 'Cartier' },
    { id: 'price-filter', label: 'Filter by Price' }
  ],
  company: [
    { id: 'about', label: 'About Us' },
    { id: 'location', label: 'Visit Us' },
    { id: 'hours', label: 'Opening Hours' }
  ],
  booking: [
    { id: 'book-now', label: 'Schedule a Viewing' },
    { id: 'book-faq', label: 'Appointment FAQs' }
  ],
  contact: [
    { id: 'phone', label: 'Call Us' },
    { id: 'email', label: 'Email Us' },
    { id: 'whatsapp', label: 'WhatsApp' }
  ]
}

const ANSWERS = {
  'about': `Grand Watch Gallery is Malaysia's most trusted and well-known luxury watch reseller. We offer Brand New and authenticated pre-owned watches from premium brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Tudor, Cartier, and Richard Mille.`,
  'location': `📍 Visit Us:\n\nLot G19, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23\nDamansara Jaya, Petaling Jaya`,
  'hours': `⏰ For current operating hours, please call us at +603 89966788`,
  'book-now': `To schedule a viewing:\n\n📞 Phone: +603 89966788\n📧 Email: info@grandwatchgallery.my`,
  'book-faq': `• Do I need an appointment? Yes\n• How long? 30-60 minutes\n• Can I see specific watches? Yes\n• Is there a cost? No, it's free`,
  'phone': `📞 Phone: +603 89966788`,
  'email': `📧 Email: info@grandwatchgallery.my`,
  'whatsapp': `💬 WhatsApp: +603 89966788`,
  'price-filter': `What's your budget?\n\n• Under 30k\n• 30k - 50k\n• 50k - 100k\n• 100k+`,
  'rolex': `Rolex Watches available. Click "Browse Watches" then "Rolex Watches" to see our collection.`,
  'patek': `Patek Philippe available. Click "Browse Watches" then "Patek Philippe" to see our collection.`,
  'all-brands': `We carry: Rolex, Patek Philippe, Audemars Piguet, Omega, Tudor, Cartier, Richard Mille`
}

// Keyword mapping
const KEYWORD_MAP = {
  'hi|hello|hey|greetings|good morning|good afternoon': 'main',
  'rolex': 'rolex',
  'patek|philippe': 'patek',
  'audemars|piguet': 'audemars',
  'omega': 'omega',
  'tudor': 'tudor',
  'cartier': 'cartier',
  'richard|mille': 'richard-mille',
  'price|budget|under|cost|how much': 'price-filter',
  'location|address|where|visit': 'location',
  'phone|call|contact': 'phone',
  'email': 'email',
  'whatsapp|wechat': 'whatsapp',
  'appointment|book|viewing|schedule': 'book-now',
  'about|company|who': 'about',
  'hours|open|closing|time': 'hours'
}

function detectKeyword(text) {
  const lowerText = text.toLowerCase()
  for (const [keywords, actionId] of Object.entries(KEYWORD_MAP)) {
    const keywordArray = keywords.split('|')
    if (keywordArray.some(kw => lowerText.includes(kw))) {
      return actionId
    }
  }
  return null
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 Welcome to Grand Watch Gallery. How can I help you today?",
      sender: 'bot',
      options: MAIN_MENU
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentMenu, setCurrentMenu] = useState('main')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userInput = input.trim()
    const userMessage = { id: Date.now(), text: userInput, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Pause for 1 second to think
    await new Promise(resolve => setTimeout(resolve, 1000))

    const detectedKeyword = detectKeyword(userInput)
    let botResponse = null
    let nextMenu = 'main'
    let nextOptions = MAIN_MENU

    if (detectedKeyword) {
      // Direct answer from keyword
      if (ANSWERS[detectedKeyword]) {
        botResponse = ANSWERS[detectedKeyword]
        botResponse += `\n\n---\n\nWhat else can I help with?`
      }
      // Navigate to submenu
      else if (SUBMENU[detectedKeyword]) {
        botResponse = `Let me show you available options:`
        nextMenu = detectedKeyword
        nextOptions = SUBMENU[detectedKeyword]
      }
      // Try main menu options
      else {
        const mainOption = MAIN_MENU.find(m => m.id === detectedKeyword)
        if (mainOption) {
          botResponse = `You're asking about: ${mainOption.label}\n\nWhat would you like to know?`
          nextMenu = detectedKeyword
          nextOptions = SUBMENU[detectedKeyword] || []
        }
      }
    } else {
      botResponse = `I didn't quite understand. Please select from the options below or try typing a keyword like:\n\n• "rolex" or "patek"\n• "price" or "budget"\n• "appointment" or "contact"\n• "location"`
      nextOptions = MAIN_MENU
    }

    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      options: nextOptions
    }
    setMessages(prev => [...prev, botMessage])
    setCurrentMenu(nextMenu)
    setLoading(false)
  }

  const handleOptionClick = async (optionId) => {
    const userMessage = { id: Date.now(), text: optionId, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    let botResponse = null
    let nextMenu = 'main'
    let nextOptions = MAIN_MENU

    // If answer exists, show it
    if (ANSWERS[optionId]) {
      botResponse = ANSWERS[optionId]
      botResponse += `\n\n---\n\nWhat else can I help with?`
    }
    // If submenu exists, show it
    else if (SUBMENU[optionId]) {
      botResponse = `What would you like to know?`
      nextMenu = optionId
      nextOptions = SUBMENU[optionId]
    }

    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      options: nextOptions
    }
    setMessages(prev => [...prev, botMessage])
    setCurrentMenu(nextMenu)
    setLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          left: '20px',
          bottom: '20px',
          zIndex: 1000,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#B08D57',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}
        title="Chat with us"
      >
        {isOpen ? (
          <X size={24} color="#fff" />
        ) : (
          <MessageCircle size={24} color="#fff" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: '20px',
            bottom: '90px',
            zIndex: 999,
            width: '360px',
            maxHeight: '500px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#B08D57',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            Grand Watch Gallery
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: msg.sender === 'user' ? '#B08D57' : '#F4EFE9',
                    color: msg.sender === 'user' ? '#fff' : '#333',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Options Grid */}
          {messages[messages.length - 1]?.options && messages[messages.length - 1]?.options.length > 0 && (
            <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid #F4EFE9', background: '#fafaf8' }}>
              {messages[messages.length - 1].options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={loading}
                  style={{
                    background: '#F4EFE9',
                    border: '1px solid #E8E2D8',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    fontSize: '11px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    color: '#333',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={e => { if (!loading) { e.target.style.background = '#B08D57'; e.target.style.color = '#fff' } }}
                  onMouseLeave={e => { e.target.style.background = '#F4EFE9'; e.target.style.color = '#333' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ display: 'flex', gap: '6px', padding: '10px', borderTop: '1px solid #F4EFE9', background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type keywords..."
              style={{
                flex: 1,
                border: '1px solid #E8E2D8',
                padding: '8px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                color: '#333',
                backgroundColor: '#fff'
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: '#B08D57',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 10px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading || !input.trim() ? 0.6 : 1
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
