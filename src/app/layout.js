import { Barlow } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import PublicShell from '@/components/PublicShell'
import Script from 'next/script'

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
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KTDXWQRC9C" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KTDXWQRC9C');
        `}</Script>
      </head>
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
