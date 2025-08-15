import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Collections from "./pages/Collections/Collections";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <main>
        {/*необхідно розмістити всередині <BrowserRouter>,  щоб він мав доступ до роутінгу (наприклад, для використання Link або useLocation). */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/collections" element={<Collections />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
