import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardPage from "./routes/dashboard/page";
import Layout from "./routes/layout";
import Banner from "./pages/Banner";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Subcategory from "./pages/Subcategory";
import Blogs from "./pages/Blogs";
import Testimonials from "./pages/Testimonials";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./routes/auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "banner", element: <Banner /> },
            { path: "products", element: <Product /> },
            { path: "category", element: <Category /> },
            { path: "subcategory", element: <Subcategory /> },
            { path: "blogs", element: <Blogs /> },
            { path: "testimonials", element: <Testimonials /> },
            { path: "orders", element: <Orders /> },
            { path: "users", element: <Users /> },
            { path: "settings", element: <Settings /> },
          ],
        },
      ],
    },
    {
      path: "/auth/sign-in",
      element: <Login />,
    },
    {
      path: "*",
      element: <Navigate to="/auth/sign-in" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
