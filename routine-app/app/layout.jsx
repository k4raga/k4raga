import './globals.css'
import Background from '@/components/Background/Background'

export const metadata = {
  title: 'Рутина — K4RAGA',
  description: 'Рутина, ккал, спорт — K4RAGA'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Background />
        {children}
      </body>
    </html>
  )
}
