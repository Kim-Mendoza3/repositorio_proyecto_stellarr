import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import FreighterSetupBanner from "@/components/FreighterSetupBanner";

export const metadata: Metadata = {
  title: "StudyTrips Global - Financiamiento de viajes de estudio",
  description: "Financia tus viajes de estudio con seguridad blockchain y autenticación biométrica.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen font-sans">
        <WalletProvider>
          {isDev && <FreighterSetupBanner />}
          <div className={isDev ? "pt-32" : ""}>
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
