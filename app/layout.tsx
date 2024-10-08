import { AuthProv } from "@/layout/authProv";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChakraProviders } from "./chakraProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reference Adresse",
  description: "Created by ISTEAH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ChakraProviders>
          <AuthProv>
            {children}
          </AuthProv>
        </ChakraProviders>
      </body>
    </html>
  );
}
