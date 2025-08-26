import styles from "./Header.module.css";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Button from "../Button/Button";

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className={styles.header}>
      <div>
        <h1>
          <Link to="/collections">Speakly</Link>
        </h1>
      </div>
      <div>
        <ul>
          {!user && (
            <li>
              <Link to="/login">
                <Button glowing>Увійти</Button>
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/register">
                <Button glowing>Зареєструватися</Button>
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/profile">
                <Button glowing>Профіль</Button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
