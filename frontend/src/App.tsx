import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Collections from "./pages/Collections/Collections/Collections";
import AddNewCollection from "./pages/Collections/AddNewCollection/AddNewCollection";
import CollectionView from "./pages/Collections/CollectionView/CollectionView";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="collections">
            <Route index element={<Collections />} />
            <Route path="new" element={<AddNewCollection />} />{" "}
            <Route path=":id" element={<CollectionView />} />{" "}
          </Route>

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
