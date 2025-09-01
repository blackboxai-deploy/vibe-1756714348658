import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tanish Creates - Cinematic Cricket Intro",
  description: "A stunning 3D cricket intro animation featuring realistic physics, dynamic camera work, and cinematic effects",
  keywords: "cricket, 3D animation, Three.js, cinematic, sports animation",
  authors: [{ name: "Tanish Creates" }],
  openGraph: {
    title: "Tanish Creates - Cinematic Cricket Intro",
    description: "Experience a stunning 3D cricket intro animation with realistic physics and cinematic effects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}