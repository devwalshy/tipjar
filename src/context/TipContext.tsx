import React, { createContext, useState, useContext } from "react";
import { PartnerHours, DistributionData, PartnerPayout } from "@shared/schema";

interface TipContextType {
  partnerHours: PartnerHours;
  setPartnerHours: React.Dispatch<React.SetStateAction<PartnerHours>>;
  extractedText: string;
  setExtractedText: React.Dispatch<React.SetStateAction<string>>;
  distributionData: DistributionData | null;
  setDistributionData: React.Dispatch<
    React.SetStateAction<DistributionData | null>
  >;
}

const TipContext = createContext<TipContextType | undefined>(undefined);

export function TipContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [partnerHours, setPartnerHours] = useState<PartnerHours>([]);
  const [extractedText, setExtractedText] = useState<string>("");
  const [distributionData, setDistributionData] =
    useState<DistributionData | null>(null);

  return (
    <TipContext.Provider
      value={{
        partnerHours,
        setPartnerHours,
        extractedText,
        setExtractedText,
        distributionData,
        setDistributionData,
      }}
    >
      {children}
    </TipContext.Provider>
  );
}

export function useTipContext() {
  const context = useContext(TipContext);
  if (context === undefined) {
    throw new Error("useTipContext must be used within a TipContextProvider");
  }
  return context;
}
