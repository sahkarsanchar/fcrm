import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../helper/tokenHelper";

const ProtectedRoute = () => {
  const token = getToken();

  return token ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;
