import styles from "./Header.module.css";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("user: ", user);

  return (
    <header className={styles.header}>
      <div>
        <h1>
          <Link to="/">Speakly</Link>
        </h1>
      </div>
      <div>
        <ul>
          {!user && (
            <li>
              <Link to="/login">Увійти</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/register">Зареєструватися</Link>
            </li>
          )}
          <li>{user && <Link to="/profile">Профіль</Link>}</li>
        </ul>
      </div>
    </header>
  );
}
