import { createContext, useContext, useEffect, useState } from "react";

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
    localStorage.setItem("currency", currency);
  }, [themeMode, currency]);

  const isDark = themeMode === "dark";

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const currencySymbol = currencySymbols[currency] || "₹";

  const formatCurrency = (amount) => {
    return `${currencySymbol}${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const theme = {
    isDark,

    appBg: isDark ? "#0F172A" : "#F8FAFC",
    cardBg: isDark ? "#1F2937" : "white",
    inputBg: isDark ? "#111827" : "white",
    softBg: isDark ? "#374151" : "#F3E8FF",

    sidebarBg: isDark
      ? "linear-gradient(180deg, #020617 0%, #0F172A 100%)"
      : "linear-gradient(180deg, #211951 0%, #140F2D 100%)",

    textColor: isDark ? "#F9FAFB" : "#111827",
    mutedText: isDark ? "#CBD5E1" : "#64748B",
    borderColor: isDark ? "#4B5563" : "#E5E7EB",
  };

  return (
    <AppSettingsContext.Provider
      value={{
        themeMode,
        setThemeMode,
        currency,
        setCurrency,
        currencySymbol,
        formatCurrency,
        ...theme,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }

  return context;
}