'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

// FAQ Knowledge Base
const FAQ = {
  contact: {
    keywords: ['contact', 'phone', 'email', 'reach', 'call', 'message'],
    answer: "📞 **Contact Us:**\n\n📱 Phone: +603 89966788\n📧 Email: info@grandwatchgallery.my\n📍 Location: Lot G19, Ground Floor, Atria Shopping Gallery, Jalan SS 22/23, Damansara Jaya, Petaling Jaya"
  },
  location: {
    keywords: ['location', 'address', 'where', 'visit', 'store', 'gallery', 'petaling jaya', 'damansara'],
    answer: "📍 **Our Location:**\n\nLot G19, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23\nDamansara Jaya, Petaling Jaya"
  },
  about: {
    keywords: ['about', 'who', 'company', 'trusted', 'authentic', 'reseller'],
    answer: "ℹ️ **About Grand Watch Gallery:**\n\nMalaysia's Most Trusted and Well-known luxury watch reseller. We offer Brand New and authenticated pre-owned watches from premium brands like Rolex, Patek Philippe, Audemars Piguet, Omega, Tudor, and more."
  },
  brands: {
    keywords: ['brands', 'which', 'carry', 'rolex', 'patek', 'philippe', 'omega', 'tudor', 'audemars', 'cartier'],
    answer: "⌚ **We Carry:**\n\n✓ Rolex\n✓ Patek Philippe\n✓ Audemars Piguet\n✓ Omega\n✓ Tudor\n✓ Cartier\n✓ Richard Mille\n✓ And more luxury brands"
  },
  condition: {
    keywords: ['condition', 'new', 'pre-owned', 'used', 'excellent', 'good'],
    answer: "✨ **Watch Conditions:**\n\nWe offer watches in various conditions:\n• Brand New - Unworn, sealed\n• Excellent - Minimal wear\n• Good - Normal wear\n• Pre-owned - Authenticated\n\nAll watches are professionally inspected."
  },
  appointment: {
    keywords: ['appointment', 'booking', 'viewing', 'private', 'schedule', 'book', 'visit'],
    answer: "📅 **Book an Appointment:**\n\nVisit our website to schedule a private viewing or click \"BOOK APPOINTMENT\" to reserve your time with us. We offer a personalized, one-on-one experience."
  },
  experience: {
    keywords: ['experience', 'private', 'viewing', 'gallery', 'one-on-one', 'unhurried', 'browse'],
    answer: "🏛️ **Gallery Experience:**\n\nOur gallery is designed for an unhurried, one-on-one experience. Browse authenticated timepieces with no pressure and full expert guidance available."
  },
  hours: {
    keywords: ['hours', 'open', 'closing', 'time', 'when'],
    answer: "⏰ **For our operating hours, please contact us:**\n\n📞 +603 89966788\n📧 info@grandwatchgallery.my\n\nOr visit our location in Petaling Jaya."
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 Welcome to Grand Watch Gallery. How can I help you today? Feel free to ask about our watches, location, or anything else!",
      sender: 'bot'
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findAnswer = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    for (const category in FAQ) {
      const faq = FAQ[category]
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer
      }
    }

    return "Thanks for your message! 😊 I'm not sure about that, but feel free to ask me about our watches, location, hours, or contact us directly at 📞 +603 89966788 or 📧 info@grandwatchgallery.my"
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])

    const reply = findAnswer(input)
    const botMessage = {
      id: Date.now() + 1,
      text: reply,
      sender: 'bot'
    }

    setMessages(prev => [...prev, botMessage])
    setInput('')
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

          {/* Input */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px',
              borderTop: '1px solid #F4EFE9',
              background: '#fff'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: '1px solid #E8E2D8',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                color: '#333',
                backgroundColor: '#fff'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: '#B08D57',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !input.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
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
