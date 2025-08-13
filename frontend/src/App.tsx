import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <main>
        {/*необхідно розмістити всередині <BrowserRouter>,  щоб він мав доступ до роутінгу (наприклад, для використання Link або useLocation). */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
