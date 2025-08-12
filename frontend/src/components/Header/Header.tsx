import styles from "./Header.module.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className={styles.header}>
      <div>
        <h1>
          <Link to="/">Speakly</Link>
        </h1>
      </div>
      <div>
        <Link to="/login">Увійти</Link>
        <Link to="/register">Зареєструватися</Link>
      </div>
    </header>
  );
}
