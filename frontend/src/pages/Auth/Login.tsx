import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";
import { useActionState } from "react";
import { loginUser } from "../../services/authService";
import { authActions } from "../../store/authSlice";
import { useDispatch } from "react-redux";

type LoginFormState = {
  email: string;
  password: string;
  errors: string[];
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (state: LoginFormState, formData: FormData) => {
    const loginFormData = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    const errors: string[] = [];

    if (errors.length === 0) {
      try {
        const response = await loginUser(loginFormData);
        if (response.error) {
          errors.push(response.error);
        } else {
          dispatch(authActions.login(response));
          navigate("/");
        }
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

      <ErrorBox errors={formState.errors}></ErrorBox>

      <Button glowing>Увійти</Button>
    </form>
  );
}
