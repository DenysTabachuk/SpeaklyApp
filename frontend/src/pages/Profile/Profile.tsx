import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Button from "../../components/Button/Button";
import styles from "./Prodile.module.css";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <div className={styles.profilePage}>
      <h2>Профіль користувача</h2>
      <p>Привіт, {user?.name}</p>
      <Button glowing onClick={handleLogout}>
        Вийти
      </Button>
    </div>
  );
}
