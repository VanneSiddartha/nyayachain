import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "NyayaChain | Digital Evidence Custody",
  description: "Secure digital legal document custody and tamper detection.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
