import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

type RegisterFormState = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: string[];
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (state: RegisterFormState, formData: FormData) => {
    const userInfo = {
      nickname: String(formData.get("nickname") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirm-password") || ""),
    };

    const errors: string[] = [];

    if (userInfo.password !== userInfo.confirmPassword) {
      errors.push("Паролі не однакові");
    }

    if (errors.length === 0) {
      try {
        const response = await registerUser(userInfo);
        if (response.error) {
          errors.push(response.error);
        } else {
          navigate("/login");
        }
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "Невідома помилка");
      }
    }

    return { ...userInfo, errors };
  };

  const [formState, formAction] = useActionState(handleSubmit, {
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: [],
  });

  return (
    <form action={formAction} className={styles.authForm}>
      <h2>Реєстрація</h2>

      <Input
        label="Псевдонім"
        id="nickname"
        type="text"
        name="nickname"
        required
        defaultValue={formState.nickname}
        minLength={4}
      />

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
        minLength={6}
      />

      <Input
        label="Повторіть пароль"
        type="password"
        id="confirm-password"
        name="confirm-password"
        required
        defaultValue={formState.confirmPassword}
        minLength={6}
      />

      <ErrorBox errors={formState.errors}></ErrorBox>

      <Button glowing>Зареєструватися</Button>
    </form>
  );
}
