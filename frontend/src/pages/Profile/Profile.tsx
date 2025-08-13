import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  //toDO : Додати обробку випадку, якщо користувач не авторизований

  return <p>Привіт, {user?.name}</p>;
}
