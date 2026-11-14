import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Archivo } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "Boluwatife Osineye — Full-Stack Engineer | React Native, Next.js";
const description =
  "Boluwatife Osineye is a full-stack engineer in Nigeria building React Native, React and Next.js apps for logistics, payments and commerce, and AI agents built on Claude.";

export const metadata: Metadata = {
  metadataBase: new URL("https://boluwatifeosineye.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Boluwatife Osineye",
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  authors: [{ name: "Boluwatife Osineye", url: "https://boluwatifeosineye.com" }],
  creator: "Boluwatife Osineye",
  keywords: [
    "full-stack engineer",
    "React Native",
    "Expo",
    "React",
    "Next.js",
    "TypeScript",
    "mobile engineer",
    "frontend engineer",
    "Nigeria",
    "remote",
  ],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0A09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibstedGrotesk.variable} ${archivo.variable}`}>
      <head>
        {/* collage screens start at opacity 0 and are revealed by HorizonMotion;
            with JS off nothing would reveal them, so show them settled */}
        <noscript>
          <style>{`[data-screen]{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
