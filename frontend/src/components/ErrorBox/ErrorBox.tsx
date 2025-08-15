import styles from "./ErrorBox.module.css";

type ErrorBoxPropsType = {
  errors?: string[];
};

const errorMessages: Record<string, string> = {
  "Invalid credentials": "Невірний email або пароль",
  // можна додавати інші
};

export default function ErrorBox({ errors = [] }: ErrorBoxPropsType) {
  return (
    errors?.length > 0 && (
      <div className={`${styles.errorBox} ${errors.length > 0 && styles.show}`}>
        <ul>
          {errors.map((error) => (
            <li key={error}>
              <b>{errorMessages[error] || error}</b>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
