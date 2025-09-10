import Layout from "./Layout";
import MyCollectionsPage from "./pages/Collections/MyCollectionsPage/MyCollectionsPage";
import AddNewCollection from "./pages/Collections/AddEditCollection/AddCollection";
import CollectionView from "./pages/Collections/CollectionView/CollectionView";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import EditCollection from "./pages/Collections/AddEditCollection/EditCollection";
import ErrorPage from "./ErrorElement";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loader as collectionsLoader } from "./pages/Collections/MyCollectionsPage/MyCollectionsPage";
import { loader as collectionDetailsLoader } from "./pages/Collections/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, errorElement: <ErrorPage /> },
      {
        path: "collections",
        children: [
          {
            index: true,
            element: <MyCollectionsPage />,
            errorElement: <ErrorPage />,
            loader: collectionsLoader,
          },
          {
            path: "new",
            element: <AddNewCollection />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <CollectionView />,
                loader: collectionDetailsLoader,
              },
              { path: "edit", element: <EditCollection /> },
            ],
          },
        ],
      },
      { path: "register", element: <Register />, errorElement: <ErrorPage /> },
      { path: "login", element: <Login />, errorElement: <ErrorPage /> },
      { path: "profile", element: <Profile />, errorElement: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
