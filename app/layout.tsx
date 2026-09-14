import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Boluwatife Osineye, Mobile App Developer",
  description: "I turn business problems into products that ship.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibstedGrotesk.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
