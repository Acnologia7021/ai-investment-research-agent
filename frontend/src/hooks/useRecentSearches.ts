import { useCallback, useEffect, useState } from "react";

const storageKey = "recent-company-searches";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        setRecentSearches(parsed.slice(0, 5));
      }
    }
  }, []);

  const addSearch = useCallback((company: string) => {
    setRecentSearches((current) => {
      const next = [company, ...current.filter((item) => item.toLowerCase() !== company.toLowerCase())].slice(0, 5);
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentSearches, addSearch };
};
