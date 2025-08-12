import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { useActionState } from "react";
import { loginUser } from "../../services/authService";
import styles from "./AuthForm.module.css";

type LoginFormState = {
  email: string;
  password: string;
  errors: string[];
};

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (state: LoginFormState, formData: FormData) => {
    const loginFormData = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    const errors: string[] = [];

    if (errors.length === 0) {
      try {
        await loginUser(loginFormData);
        navigate("/");
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "Невідома помилка");
      }
    }

    return { ...loginFormData, errors };
  };

  const [formState, formAction] = useActionState(handleSubmit, {
    email: "",
    password: "",
    errors: [],
  });

  return (
    <form action={formAction} className={styles.authForm}>
      <h2>Вхід</h2>
      <Input
        label="Е-адреса"
        type="email"
        name="email"
        required
        defaultValue={formState.email}
      />

      <Input
        label="Пароль"
        type="password"
        id="password"
        name="password"
        required
        defaultValue={formState.password}
      />

      {formState.errors?.length > 0 && (
        <ul className="errors">
          {formState.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <button>Увійти</button>
    </form>
  );
}
