import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please login to access this page");
  }
  return token ? <Outlet /> : <Navigate to="/landing" />;
};

export default PrivateRoute;
