import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <div>
          <h1>Помилка {error.status}</h1>
          <p>{error.statusText}</p>
        </div>
      </main>
    );
  }

  if (error instanceof Error) {
    return (
      <main>
        <div>
          <h1>Невідома помилка</h1>
          <p>{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div>
        <h1>Невідома помилка</h1>
        <p>{String(error)}</p>
      </div>
    </main>
  );
}
