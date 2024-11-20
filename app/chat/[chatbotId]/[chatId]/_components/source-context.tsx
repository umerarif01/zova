"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Source {
  id: string;
  name: string;
  type: string;
  sourceUrl: string;
  chatbotId: string;
  userId: string;
  createdAt: Date;
}

interface SourceContextType {
  currentSource: Source | null;
  setCurrentSource: (source: Source) => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

interface SourceProviderProps {
  children: ReactNode;
  initialSource?: Source;
}

export function SourceProvider({
  children,
  initialSource,
}: SourceProviderProps) {
  const [currentSource, setCurrentSource] = useState<Source | null>(
    initialSource || null
  );

  return (
    <SourceContext.Provider value={{ currentSource, setCurrentSource }}>
      {children}
    </SourceContext.Provider>
  );
}

export function useSourceContext() {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error("useSourceContext must be used within a SourceProvider");
  }
  return context;
}
