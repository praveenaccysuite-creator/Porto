import { useEffect, useState, useCallback } from "react";

function useFetch<T>(fetcher: () => Promise<T | null>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetcher();
      setData(res);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    setData,
    refetch: fetchData,
  };
}

export default useFetch;
