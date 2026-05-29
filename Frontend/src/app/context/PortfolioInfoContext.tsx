"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { PortfolioInfo } from "@/types/portfolio";

interface PortfolioInfoContextType {
  info: PortfolioInfo | null;
  setInfo: React.Dispatch<React.SetStateAction<PortfolioInfo | null>>;
}

const PortfolioInfoContext =
  createContext<PortfolioInfoContextType | null>(null);

export const PortfolioInfoProvider = ({
  children,
  initialInfo = null,
}: {
  children: React.ReactNode;
  initialInfo?: PortfolioInfo | null;
}) => {
  const [info, setInfo] = useState<PortfolioInfo | null>(initialInfo);

  const value = useMemo(() => ({ info, setInfo }), [info]);

  return (
    <PortfolioInfoContext.Provider value={value}>
      {children}
    </PortfolioInfoContext.Provider>
  );
};

export const usePortfolioInfoContext = (): PortfolioInfoContextType => {
  const context = useContext(PortfolioInfoContext);

  if (!context) {
    throw new Error(
      "usePortfolioInfoContext must be used within PortfolioInfoProvider",
    );
  }

  return context;
};
