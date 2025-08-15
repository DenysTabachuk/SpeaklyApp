import { useEffect, useState } from "react";

// Тип для асинхронної функції, яку ми передаємо в хук
// T - це тип даних, які повертає функція
type AsyncFunction<T> = () => Promise<T>;

export function useHttp<T>(asyncFunction: AsyncFunction<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const execute = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction();
        setData(result);
      } catch (err: any) {
        // 🔹 Якщо сталася помилка, зберігаємо її у state error
        // err.message використовується, якщо це стандартний об'єкт помилки
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    //  Виконуємо асинхронну функцію execute
    execute();
  }, [asyncFunction]);

  return { data, isLoading, error };
}
