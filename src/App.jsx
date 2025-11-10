import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardPage from "./routes/dashboard/page";
import Layout from "./routes/layout";
import Users from "./pages/Users";
import Login from "./routes/auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import DepartmentManagement from "./pages/DepartmentPage";
import AddEmployee from "./pages/EmployeeCreate";


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
            { path: "users", element: <Users /> },
            { path: "department", element: <DepartmentManagement /> },
            { path: "employee", element: <AddEmployee /> },
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
