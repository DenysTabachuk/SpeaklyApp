import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import api from "../../api/api";
import { authActions } from "../../store/authSlice";
import { store } from "../../store/store";

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const error = actionData?.error;
  const values = actionData?.values || {};
  const isLoading = navigation.state === "submitting";

  return (
    <Form method="post" className={styles.authForm}>
      <h2>Вхід</h2>

      <Input
        label="Е-адреса"
        type="email"
        name="email"
        required
        disabled={isLoading}
        defaultValue={values.email || ""}
      />

      <Input
        label="Пароль"
        type="password"
        name="password"
        required
        disabled={isLoading}
        defaultValue={values.password || ""}
      />

      {error && <ErrorBox errors={[error]} />}

      <Button type="submit" glowing disabled={isLoading}>
        {isLoading ? "Завантаження..." : "Увійти"}
      </Button>
    </Form>
  );
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());

  try {
    const response = await api.post("/login", formData);
    // Оновлюємо redux store
    store.dispatch(authActions.login(response.data));
    return redirect("/collections");
  } catch (error: any) {
    // axios вважає будь-який статус-код поза діапазоном 2xx помилкою
    // Повертаємо помилку та введені дані, щоб вони залишилися у формі
    return {
      error: error.response?.data?.error || "Сталася помилка",
      values: formData,
    };
  }
}
