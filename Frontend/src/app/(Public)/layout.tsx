import React from "react";
import ClientWrapper from "./ClientWrapper";
import { fetchHomePageData } from "@/lib/fetchHomeData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Praveen's Portfolio",
  description:
    "Full-stack developer. I build fast, scalable, and user-focused web applications with clean UI and modern architecture.",
  icons: {
    icon: "/assets/img/logo.png",
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { portfolioInfo } = await fetchHomePageData();

  return (
    <ClientWrapper initialPortfolioInfo={portfolioInfo}>
      {children}
    </ClientWrapper>
  );
}
