import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
import Head from 'next/head'; 
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Track My Money",
  description: "A web app to keep track of one's expenses",
  authors: [{ name: "Harsh Bansal" }, { name: "Hemant Khemka" }],
  icons: {

    icon: '/favicon2.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <Head>
          <link rel="icon" href="/favicon2.png" />
        </Head>
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
