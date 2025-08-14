import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import { useActionState } from "react";
import { loginUser } from "../../services/authService";
import styles from "./AuthForm.module.css";
import { authActions } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import Button from "../../components/Button/Button";

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
        dispatch(authActions.login(response));
        localStorage.setItem("token", response.token);
        console.log(response);
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

      <Button glowing accept>
        Увійти
      </Button>
    </form>
  );
}
