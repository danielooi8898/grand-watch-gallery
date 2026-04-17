'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader } from 'lucide-react'

const MAIN_MENU = [
  { id: 'browse', label: '🔍 Browse Watches', icon: '⌚' },
  { id: 'company', label: '📍 Company Info', icon: 'ℹ️' },
  { id: 'booking', label: '📅 Book Appointment', icon: '📅' },
  { id: 'contact', label: '📞 Contact Us', icon: '☎️' }
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
  'about': `Grand Watch Gallery is Malaysia's most trusted and well-known luxury watch reseller. We offer Brand New and authenticated pre-owned watches from premium brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Tudor, Cartier, and Richard Mille.\n\nOur gallery provides an unhurried, one-on-one experience where you can browse authenticated timepieces with no pressure and full expert guidance.`,
  'location': `📍 Visit Us:\n\nLot G19, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23\nDamansara Jaya, Petaling Jaya\n\n🗺️ Easy access and ample parking available`,
  'hours': `⏰ Operating Hours:\n\nFor current operating hours, please call us at +603 89966788 or check our website at grandwatchgallery.my`,
  'book-now': `To schedule a private viewing:\n\n📞 Phone: +603 89966788\n📧 Email: info@grandwatchgallery.my\n\nOur team will arrange a time that suits you best. We offer a personalized, pressure-free experience.`,
  'book-faq': `Common Questions About Appointments:\n\n• Do I need an appointment? Yes, we offer appointments to ensure personalized attention.\n• How long does a viewing take? Usually 30-60 minutes depending on your preferences.\n• Can I see specific watches? Yes, let us know your interests when booking.\n• Is there a cost? No, consultations are completely free.`,
  'phone': `📞 Phone: +603 89966788\n\nCall us during business hours to discuss your watch preferences or to book a viewing.`,
  'email': `📧 Email: info@grandwatchgallery.my\n\nSend us your inquiries and we'll respond within 24 hours.`,
  'whatsapp': `💬 WhatsApp: +603 89966788\n\nQuick conversations and instant replies via WhatsApp.`,
  'price-filter': `What's your budget range?\n\n• Under 30k MYR\n• 30k - 50k MYR\n• 50k - 100k MYR\n• 100k+ MYR\n\nLet me know and I'll show you available watches in that range.`
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
  const [currentMenu, setCurrentMenu] = useState('main')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleOptionClick = async (optionId) => {
    const userMessage = { id: Date.now(), text: optionId, sender: 'user' }
    setMessages(prev => [...prev, userMessage])

    // Pause for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000))

    let botResponse = null
    let nextMenu = null
    let nextOptions = null

    // Main menu
    if (currentMenu === 'main') {
      const selected = MAIN_MENU.find(m => m.id === optionId)
      if (selected) {
        botResponse = `You selected: ${selected.label}\n\nWhat would you like to know?`
        nextMenu = optionId
        nextOptions = SUBMENU[optionId] || []
      }
    }
    // Submenus
    else if (ANSWERS[optionId]) {
      botResponse = ANSWERS[optionId]
      nextMenu = 'main'
      nextOptions = MAIN_MENU
      botResponse += `\n\n---\n\nWhat else can I help with?`
    }

    if (botResponse) {
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        options: nextOptions
      }
      setMessages(prev => [...prev, botMessage])
      if (nextMenu) setCurrentMenu(nextMenu)
    }
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
            {messages[messages.length - 1]?.options && messages[messages.length - 1]?.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {messages[messages.length - 1].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}
                    style={{
                      background: '#F4EFE9',
                      border: '1px solid #E8E2D8',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#333',
                      transition: 'all 0.2s',
                      ':hover': { background: '#B08D57', color: '#fff' }
                    }}
                    onMouseEnter={e => { e.target.style.background = '#B08D57'; e.target.style.color = '#fff' }}
                    onMouseLeave={e => { e.target.style.background = '#F4EFE9'; e.target.style.color = '#333' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
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
