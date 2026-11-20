import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2437472166992048');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2437472166992048&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink scroll-smooth">
        <CartProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <GlobalCanvas />
        </CartProvider>
      </body>
    </html>
  );
}

