import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { useHttp } from "../../hooks/useHtpp";
import { useEffect } from "react";

type RegisterFormState = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
};

export default function RegisterPage() {
  const { data, isLoading, error, execute } = useHttp(registerUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      // якщо data не null значить, успішно виконали запит на реєстрацію
      navigate("/login");
      console.log(data);
    }
  }, [data, navigate]);

  const handleSubmit = async (state: RegisterFormState, formData: FormData) => {
    const userInfo = {
      nickname: String(formData.get("nickname") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirm-password") || ""),
    };

    if (userInfo.password !== userInfo.confirmPassword) {
      return { ...userInfo, error: "Паролі не однакові" };
    }

    await execute(userInfo);

    return { ...userInfo, error: null };
  };

  const [formState, formAction] = useActionState(handleSubmit, {
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
  });

  const errorMessages: string[] = [];
  if (formState.error) errorMessages.push(formState.error); // клієнтська
  if (error) errorMessages.push(error); // серверна

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
        disabled={isLoading}
      />

      <Input
        label="Е-адреса"
        type="email"
        name="email"
        required
        defaultValue={formState.email}
        disabled={isLoading}
      />

      <Input
        label="Пароль"
        type="password"
        id="password"
        name="password"
        required
        defaultValue={formState.password}
        minLength={6}
        disabled={isLoading}
      />

      <Input
        label="Повторіть пароль"
        type="password"
        id="confirm-password"
        name="confirm-password"
        required
        defaultValue={formState.confirmPassword}
        minLength={6}
        disabled={isLoading}
      />
      {/* toDO: зробити плавну появу та зникнення */}
      <ErrorBox errors={errorMessages} />

      <Button glowing disabled={isLoading}>
        Зареєструватися
      </Button>
    </form>
  );
}
