"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PortfolioInfoProvider } from "../context/PortfolioInfoContext";
import type { PortfolioInfo } from "@/types/portfolio";

const Chatbot = dynamic(() => import("./components/Chatbot"), {
  ssr: false,
  loading: () => null,
});

interface ClientWrapperProps {
  children: React.ReactNode;
  initialPortfolioInfo?: PortfolioInfo | null;
}

export default function ClientWrapper({
  children,
  initialPortfolioInfo = null,
}: ClientWrapperProps) {
  return (
    <PortfolioInfoProvider initialInfo={initialPortfolioInfo}>
      {children}
      <Chatbot />
    </PortfolioInfoProvider>
  );
}
