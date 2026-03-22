import { Barlow } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import AdminBar from '@/components/AdminBar'
import { AuthProvider } from '@/context/AuthContext'

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata = {
  title: 'Grand Watch Gallery | The Right Time For Life',
  description: "Malaysia's premier authenticated pre-owned luxury watch gallery. Rolex, Patek Philippe, Audemars Piguet, Richard Mille and more.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={barlow.variable} data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <AdminBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
