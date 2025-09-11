import Layout from "./Layout";
import MyCollectionsPage from "./pages/Collections/MyCollectionsPage/MyCollectionsPage";
import AddNewCollection from "./pages/Collections/AddEditCollection/AddCollection";
import CollectionDetails from "./pages/Collections/CollectionDetailsPage/CollectionDetailsPage";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import EditCollection from "./pages/Collections/AddEditCollection/EditCollection";
import ErrorPage from "./ErrorElement";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loader as collectionsLoader } from "./pages/Collections/MyCollectionsPage/MyCollectionsPage";
import { loader as collectionDetailsLoader } from "./pages/Collections/loaders";
import { action as editCollectionAction } from "./pages/Collections/AddEditCollection/EditCollection";
import { action as addNewCollectionAction } from "./pages/Collections/AddEditCollection/AddCollection";
import { action as loginAction } from "./pages/Auth/Login";
import { action as registerAction } from "./pages/Auth/Register";

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
            action: addNewCollectionAction,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <CollectionDetails />,
                loader: collectionDetailsLoader,
              },
              {
                path: "edit",
                element: <EditCollection />,
                loader: collectionDetailsLoader,
                action: editCollectionAction,
              },
            ],
          },
        ],
      },
      { path: "register", element: <Register />, action: registerAction },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      { path: "profile", element: <Profile />, errorElement: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
