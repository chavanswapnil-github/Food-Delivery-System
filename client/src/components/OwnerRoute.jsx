import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

function OwnerRoute({ children }) {
  const token = getToken();
  const user = getUser();

  // 1. If not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but NOT an owner, redirect to customer home page
  if (!user || user.role !== "OWNER") {
    return <Navigate to="/" replace />;
  }

  // 3. Authorized access granted
  return children;
}

export default OwnerRoute;