import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <h2>Домашня сторінка</h2>
      <Link to="/collections">Колекції</Link>
    </>
  );
}
