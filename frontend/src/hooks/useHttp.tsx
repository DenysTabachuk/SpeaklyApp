import { useState } from "react";

type AsyncFunction<T, Args extends any[] = []> = (...args: Args) => Promise<T>;

export function useHttp<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<Response | T>
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: Args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);

      if (result instanceof Response) {
        const json = await result.json();
        if (!result.ok) {
          throw new Error(json.error || "HTTP error");
        }
        setData(json as T); // приводимо до T
      } else {
        setData(result);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, setData, isLoading, error, execute };
}
