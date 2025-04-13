import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google';
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});
const notoMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-noto-mono',
});

export const metadata: Metadata = {
  title: "AMIGDALA | Arteterapia con Enfoque Humanista",
  description:
    "AMIGDALA es una consultora de arteterapia con enfoque humanista que ofrece sesiones individuales, talleres grupales, consultorías corporativas y formación para educadores.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='es'
      className={`scroll-smooth ${notoSans.className} ${notoMono.className}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

