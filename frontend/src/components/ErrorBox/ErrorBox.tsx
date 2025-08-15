import styles from "./ErrorBox.module.css";

type ErrorBoxPropsType = {
  errors?: string[];
};

export default function ErrorBox({ errors = [] }: ErrorBoxPropsType) {
  return (
    errors?.length > 0 && (
      <div className={styles.errorBox}>
        <ul>
          {errors.map((error) => (
            <li key={error}>
              <b>{error}</b>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
