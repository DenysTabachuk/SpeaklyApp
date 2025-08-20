import Input from "../../components/Inputs/Input";
import Button from "../../components/Button/Button";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import styles from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";
import { useActionState } from "react";
import { loginUser } from "../../services/authService";
import { authActions } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/useHttp";
import { useEffect } from "react";

type LoginFormState = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, error, execute } = useHttp(loginUser);

  useEffect(() => {
    if (data) {
      // якщо data не null значить, успішно виконали запит на авторизацію
      dispatch(authActions.login(data));
      navigate("/");
    }
  }, [data, dispatch, navigate]);

  const handleSubmit = async (state: LoginFormState, formData: FormData) => {
    const loginFormData = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    execute(loginFormData);
    return loginFormData;
  };

  const [formState, formAction] = useActionState(handleSubmit, {
    email: "",
    password: "",
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
        disabled={isLoading}
      />

      <Input
        label="Пароль"
        type="password"
        id="password"
        name="password"
        required
        defaultValue={formState.password}
        disabled={isLoading}
      />
      {/* toDO: зробити плавну появу та зникнення */}
      <ErrorBox errors={error ? [error] : []} />

      <Button glowing disabled={isLoading}>
        {isLoading ? "Завантаження..." : "Увійти"}
      </Button>
    </form>
  );
}
