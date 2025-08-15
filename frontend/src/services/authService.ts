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
  return fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: loginData) {
  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
