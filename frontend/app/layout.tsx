import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vuurkorf Personalisatie',
  description: 'Ontwerp je eigen gepersonaliseerde vuurkorf met AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
