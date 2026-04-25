import "./globals.css";
import { SiteShellProvider } from "../components/site-shell";

export const metadata = {
  title: "REUNITE — Bring Families Back Together",
  description: "Community-powered search network for missing loved ones and reconnection stories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteShellProvider>{children}</SiteShellProvider>
      </body>
    </html>
  );
}
