import { Form, useActionData, useNavigation } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import api from "../../api/api";

export default function RegisterPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const values = actionData?.values || {};
  const error = actionData?.error;

  return (
    <Form method="post" className={styles.authForm}>
      <h2>Реєстрація</h2>

      <Input
        label="Псевдонім"
        name="nickname"
        required
        defaultValue={values.nickname || ""}
        disabled={isLoading}
      />
      <Input
        label="Е-адреса"
        type="email"
        name="email"
        required
        defaultValue={values.email || ""}
        disabled={isLoading}
      />
      <Input
        label="Пароль"
        type="password"
        name="password"
        required
        disabled={isLoading}
      />
      <Input
        label="Повторіть пароль"
        type="password"
        name="confirm-password"
        required
        disabled={isLoading}
      />

      {error && <ErrorBox errors={[error]} />}

      <Button type="submit" glowing disabled={isLoading}>
        {isLoading ? "Завантаження..." : "Зареєструватися"}
      </Button>
    </Form>
  );
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const {
    nickname,
    email,
    password,
    "confirm-password": confirmPassword,
  } = formData;

  if (password !== confirmPassword) {
    return { error: "Паролі не однакові", values: { nickname, email } };
  }

  try {
    const response = await api.post("/register", { nickname, email, password });
    return redirect("/login"); // після успіху редірект
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Сталася помилка",
      values: { nickname, email },
    };
  }
}
