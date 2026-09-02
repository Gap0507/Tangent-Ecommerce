import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const thunder = localFont({
  src: [
    {
      path: './fonts/Thunder-BlackLC.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Thunder-BlackLC.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Thunder-BlackLC.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: "--font-thunder",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tangent | Sparkling Infusion",
  description: "Zero added sugar. Crisp, sparkling infusion crafted with 100% natural ingredients.",
  icons: {
    icon: "/tangent-logo.avif",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${thunder.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink scroll-smooth">
        <CartProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}

