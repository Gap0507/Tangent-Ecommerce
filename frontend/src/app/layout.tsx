import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { GlobalCanvas } from "@/components/GlobalCanvas";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal"],
  display: "swap",
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
  metadataBase: new URL("https://tangentfnb.com/"), // Placeholder URL, replace with actual
  title: {
    default: "Tangent | Daily Vitamins. Zero Crash.",
    template: "%s | Tangent",
  },
  description: "Tangent is a vitamin-infused functional drink that supports everyday energy, hydration, and wellness with zero sugar and great taste. 100% natural ingredients.",
  keywords: [
    "sparkling water", "vitamin infused drink", "zero sugar beverage", "healthy energy drink",
    "prebiotic drink", "low calorie drink", "vegan drink", "watermelon mint", "yuzu mint",
    "guava chilli", "watermelon cranberry", "functional beverage"
  ],
  authors: [{ name: "Tangent" }],
  creator: "Tangent",
  publisher: "Tangent",
  openGraph: {
    type: "website",
    locale: "en_IN", // Assuming India based on INR pricing
    url: "https://tangentfnb.com/",
    title: "Tangent | Daily Vitamins. Zero Crash.",
    description: "Tangent is a vitamin-infused functional drink that supports everyday energy, hydration, and wellness with zero sugar and great taste.",
    siteName: "Tangent",
    images: [
      {
        url: "/all4bg.png",
        width: 1200,
        height: 630,
        alt: "Tangent Variety Pack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tangent | Daily Vitamins. Zero Crash.",
    description: "Tangent is a vitamin-infused functional drink that supports everyday energy, hydration, and wellness with zero sugar and great taste.",
    images: ["/all4bg.png"],
  },
  icons: {
    icon: "/tangent-logo.avif",
    apple: "/tangent-logo.avif",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          <GlobalCanvas />
        </CartProvider>
      </body>
    </html>
  );
}

