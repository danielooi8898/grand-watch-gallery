'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import AdminBar from './AdminBar'
import Chatbot from './Chatbot'

export default function PublicShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return <>{children}</>
  return (
    <>
      <AdminBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </>
  )
}
