import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { siteMeta } from "@/data/navigation";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.name,
    template: `%s | ${siteMeta.shortName}`,
  },
  description: siteMeta.description,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteMeta.name,
    title: siteMeta.name,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.name,
    description: siteMeta.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
(function(){
  try {
    var key = 'bm-theme';
    var stored = localStorage.getItem(key);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'bright' || stored === 'bright-dark')
      ? stored
      : (prefersDark ? 'bright-dark' : 'bright');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme === 'bright-dark' ? 'dark' : 'light';
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      data-theme="bright"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
