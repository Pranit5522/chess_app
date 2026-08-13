import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: "include",
    }).then(res => setOk(res.ok));
  }, []);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
