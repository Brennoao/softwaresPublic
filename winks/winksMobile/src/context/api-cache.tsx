import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { getCachedResponse, setCachedResponse } from "@/lib/api-cache-storage";
import winksApi from "@/services/winksApi";

type ApiCacheContextValue = {
  refreshVersion: number;

  refreshAll: () => void;
};

const ApiCacheContext = createContext<ApiCacheContextValue | null>(null);

export function ApiCacheProvider({ children }: { children: ReactNode }) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const refreshAll = useCallback(() => setRefreshVersion((v) => v + 1), []);

  return (
    <ApiCacheContext.Provider value={{ refreshVersion, refreshAll }}>
      {children}
    </ApiCacheContext.Provider>
  );
}

export function useApiCache() {
  const ctx = useContext(ApiCacheContext);
  if (!ctx) throw new Error("useApiCache precisa estar dentro de um ApiCacheProvider");
  return ctx;
}

export function useApi<T>(endpoint: string) {
  const { refreshVersion } = useApiCache();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      const cached = await getCachedResponse<T>(endpoint);
      if (cached !== undefined && !cancelled) {
        setData(cached);
        setFromCache(true);
        setLoading(false);
      }

      try {
        const response = await winksApi.get(endpoint);
        if (cancelled) return;
        setData(response.data);
        setFromCache(false);
        setLoading(false);
        setCachedResponse(endpoint, response.data);
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint, refreshVersion]);

  return { data, loading, fromCache };
}
