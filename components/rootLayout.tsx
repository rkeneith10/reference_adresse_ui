// components/RootLayout.tsx
"use client";
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/side-nav";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { ProgressLoader } from "nextjs-progressloader";
import React from "react";
// import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  isAuthenticated,
}) => {
  const router = useRouter();

  return (
    <html lang="en">
      <body className={`bg-white${inter.className}`}>
        <div className="">
          <ProgressLoader color="#3B82F6" showSpinner={false} />
          {isAuthenticated && <SideNav />}
          <main className="">
            {isAuthenticated && (
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>{children}</PageWrapper>
              </MarginWidthWrapper>
            )}
            {!isAuthenticated && children}{" "}
          </main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
