import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";
import "@/features/ide/code/editor.css";

const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "PHP Learn: learn PHP by writing real PHP", template: "%s · PHP Learn" },
  description:
    "Learn PHP from your first echo to PHP 8.5, in your browser: real PHP 7.4 to 8.5 interpreters, a code editor, step-by-step traces, hints and cheat sheets. In English and French.",
  openGraph: {
    title: "PHP Learn: learn PHP by writing real PHP",
    description: "Write and run real PHP (7.4 → 8.5) in your browser, step through every line, and see what changed between versions. Free, no account needed.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f0efe7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${plexSans.variable} ${plexMono.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem("phplearn-progress")||"{}").state;if(s&&s.settings){document.documentElement.dataset.theme=s.settings.theme||"light";if(s.settings.locale)document.documentElement.lang=s.settings.locale;if(s.settings.motion==="reduced")document.documentElement.dataset.motion="reduced"}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
