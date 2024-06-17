import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export interface AuthGuardLayoutProps {
  children: React.ReactNode;
}
const AuthGuardLayout: React.FC<AuthGuardLayoutProps> = ({
  children,
}): React.ReactElement => {
  const loggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    if (!loggedIn) {
      if (confirm("로그인이 필요한 서비스입니다."))
        document.location = "/login";
    }
  }, []);

  return loggedIn ? <>{children} </> : <Navigate to="/login" />;
};

export default AuthGuardLayout;
