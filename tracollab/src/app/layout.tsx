import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/authContext";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tracollab",
    description: "Create, Share, Assemble",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={"bg-[#404040]"}>
      <body className={inter.className}>
      <AuthProvider>
      <header className="bg-[#C162EA]">
        <Nav/>
      </header>
      <main>{children}</main>
      </AuthProvider>
      </body>
      </html>
  );
}
