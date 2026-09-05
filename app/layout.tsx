import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jon Kinney — Developer, CTO & Open-source Builder",
  description: "I build open-source tools, lead the technical work at Headway, and help teams find their flow. Linux, Rust, Rails, and a better way to build together with Fulcrum. Based in Green Bay, Wisconsin.",
  icons: { icon: { url: "/images/jon-kinney.jpeg", type: "image/jpeg" } },
  openGraph: {
    title: "Jon Kinney — Good software. Better ways to build it.",
    description: "Open-source tools, technical leadership, and a better development flow. Partner & CTO at Headway. Building Fulcrum.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jon Kinney — Developer, CTO & Open-source Builder",
    description: "Open-source tools, technical leadership, and a better way to build together.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Jon Kinney",
          jobTitle: "Partner & CTO",
          worksFor: { "@type": "Organization", name: "Headway", url: "https://www.headway.io/" },
          homeLocation: { "@type": "Place", name: "Green Bay, Wisconsin" },
          knowsAbout: ["Ruby on Rails", "Rust", "Linux", "Open-source software", "Technical leadership", "Agentic development"],
          sameAs: ["https://github.com/jondkinney", "https://www.linkedin.com/in/jonkinney/", "https://www.headway.io/about/jon-kinney"],
        }).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
