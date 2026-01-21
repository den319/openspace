import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@openspace/ui/src/app/globals.css'
import { ApolloProvider } from '@openspace/network/src/config/apollo'
import { SessionProvider } from '@openspace/ui/src/components/molecules/SessionProvider'
import { Header } from '@openspace/ui/src/components/organisms/Header'
import { ToastContainer } from '@openspace/ui/src/components/molecules/Toast'
import { MenuItem } from '@openspace/util/types'
import { Container } from '@openspace/ui/src/components/atoms/Container'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Openspace',
  description: 'Vehicle Parking App',
}

const MENUITEMS: MenuItem[] = [
  { label: 'Search', href: '/search' },
  { label: 'Bookings', href: '/bookings' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <ApolloProvider>
          <body className={`${inter.className} bg-gray-25`}>
            <Header menuItems={MENUITEMS} />
            <Container>{children}</Container>
            <ToastContainer />
          </body>
        </ApolloProvider>
      </SessionProvider>
    </html>
  )
}
