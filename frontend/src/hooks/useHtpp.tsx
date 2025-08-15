import { useState } from "react";

type AsyncFunction<T, A = void> = (args: A) => Promise<T>;

// У TypeScript Generics — це спосіб зробити функції, класи або типи універсальними, тобто такими,
// що можуть працювати з різними типами даних, не прив’язуючись до конкретного типу заздалегідь.

// function identity<T>(value: T): T {
//   return value;
// }

// const num = identity(42);      // TypeScript розуміє, що T = number
// const str = identity("hello"); // TypeScript розуміє, що T = string

// type AsyncFunction<T, A = void>
// Ми створюємо тип, який описує функцію.
// <T, A = void> — це Generics:
// T — тип результату, який повертає функція (Promise<T>).
// A — тип аргументу, який приймає функція.
// = void — значення за замовчуванням. Якщо аргументів немає, можна не вказувати тип при використанні.

// (args: A) => Promise<T>
// Це описує сигнатуру функції.
// args: A — функція приймає один аргумент типу A.
// => Promise<T> — функція повертає Promise, який при виконанні дасть результат типу T.

export function useHttp<T, A = void>(asyncFunction: AsyncFunction<T, A>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (args: A) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(args);
      // console.log("useHttp() result:", result);
      if (result instanceof Response) {
        // Якщо функція повертає Response, перевіряємо статус
        const json = await result.json();
        // console.log("useHttp() json: ", json);
        if (!result.ok) {
          throw new Error(json.error || "HTTP error");
        }
        setData(json);
      } else {
        // Якщо функція вже повертає готові дані
        setData(result);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, execute };
}
