import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@openspace/ui/src/app/globals.css'
import { MenuItem } from '@openspace/util/types'
import { ApolloProvider } from '@openspace/network/src/config/apollo'
import { SessionProvider } from '@openspace/ui/src/components/molecules/SessionProvider'
import { ToastContainer } from '@openspace/ui/src/components/molecules/Toast'
import { Container } from '@openspace/ui/src/components/atoms/Container'
import { Header } from '@openspace/ui/src/components/organisms/Header'
import { IsAdmin } from '@openspace/ui/src/components/organisms/IsAdmin'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Openspace | Admin',
  description: 'Admin App',
}

const MENUITEMS: MenuItem[] = [
  { label: 'Garages', href: '/' },
  { label: 'Admins', href: '/manageAdmins' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-25`}>
        <SessionProvider>
          <ApolloProvider>
            <Header type="admin" menuItems={MENUITEMS} />
            <Container>{children}</Container>
          </ApolloProvider>
        </SessionProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
