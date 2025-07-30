import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOPSIS - Pemilihan Bahan Kain Terbaik | Rizki Batik",
  description: "Sistem pendukung keputusan untuk pemilihan bahan kain terbaik di perusahaan Rizki Batik menggunakan metode TOPSIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 bg-neutral-50 p-4 md:p-6 overflow-x-hidden">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
