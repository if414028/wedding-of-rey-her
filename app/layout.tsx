import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "The Wedding of Reynaldo & Herlina",
    description: "Undangan pernikahan Reynaldo Rici dan Herlina Pardede — a love that keeps blooming.",
    icons: {
      icon: [{ url: "/images/wedding-logo-rh.png", type: "image/png" }],
      shortcut: "/images/wedding-logo-rh.png",
      apple: "/images/wedding-logo-rh.png",
    },
    openGraph: {
      title: "The Wedding of Reynaldo & Herlina",
      description: "22 · 08 · 2026 — A love that keeps blooming.",
      images: [{ url: image, width: 1736, height: 907, alt: "The Wedding of Reynaldo & Herlina" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
