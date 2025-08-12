export type RegisterData = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type loginData = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterData) {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const resultData = await response.json().catch(() => ({}));
    throw new Error(
      resultData.error ||
        "Сталася невідома помилка, спробуйте зареєструватися пізніше."
    );
  }

  return response.json();
}

export async function loginUser(data: loginData) {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const resultData = await response.json().catch(() => ({}));
    throw new Error(
      resultData.error ||
        "Сталася невідома помилка, спробуйте авторизуватися пізніше."
    );
  }

  return response.json();
}
