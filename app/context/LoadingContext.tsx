"use client";
import { createContext, useContext, useState } from "react";
import GlobalLoading from "../components/GlobalLoading";

type LoadingContextType = {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && <GlobalLoading />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading debe usarse dentro de LoadingProvider");
  return ctx;
}
