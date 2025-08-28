import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import MyCollections from "./pages/Collections/MyCollectionsList/MyCollections";
import AddNewCollection from "./pages/Collections/AddEditCollection/AddCollection";
import CollectionView from "./pages/Collections/CollectionView/CollectionView";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import EditCollection from "./pages/Collections/AddEditCollection/EditCollection";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="collections">
            <Route index element={<MyCollections />} />
            <Route path="new" element={<AddNewCollection />} />
            <Route path=":id">
              <Route path="" element={<CollectionView />} />
              <Route path="edit" element={<EditCollection />} />
            </Route>
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
