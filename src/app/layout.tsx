import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jbmono", display: "swap" });

export const metadata: Metadata = {
  title: "PPE Detection — Safety Analytics",
  description: "Site PPE compliance monitoring and analytics",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d8d1c6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${jakarta.variable} ${jbmono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('ppe-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <div className="bg-layer" aria-hidden="true">
          <video className="bg-video" autoPlay muted loop playsInline preload="auto" poster="">
            <source src="/videos/sunset.mp4" type="video/mp4" />
          </video>
          <div className="bg-scrim" />
        </div>
        {children}
      </body>
    </html>
  );
}
