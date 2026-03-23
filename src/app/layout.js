import { Barlow } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import PublicShell from '@/components/PublicShell'

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
          <PublicShell>
            {children}
          </PublicShell>
        </AuthProvider>
      </body>
    </html>
  )
}
