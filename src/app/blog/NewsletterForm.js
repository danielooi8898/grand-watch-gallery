'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', data: { email, name: 'Newsletter Subscriber' } }),
      })
      // Fire-and-forget DB store
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', name: 'Newsletter Subscriber', email, data: { email } }),
      }).catch(() => {})
      setSent(true)
    } catch { setSent(true) }
    finally { setLoading(false) }
  }

  if (sent) return (
    <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#B08D57', marginTop:'1rem' }}>
      ✓ You&rsquo;re subscribed. Thank you!
    </p>
  )

  return (
    <form onSubmit={submit} style={{ display:'flex', gap:'0' }}>
      <input
        type="email" required
        value={email} onChange={e => setEmail(e.target.value)}
        className="input" placeholder="Your email address"
        style={{ flex:1, borderRight:'none' }}
      />
      <button type="submit" disabled={loading} className="btn btn-gold" style={{ borderRadius:0, flexShrink:0 }}>
        {loading ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
