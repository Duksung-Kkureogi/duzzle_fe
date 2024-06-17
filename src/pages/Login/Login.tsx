import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

import "./Login.css";

function Login() {
  const { user, logout, web3auth, web3AuthInit, duzzleLoggedIn, getDal } =
    useAuth();
  const [userDal, setUserDal] = useState(0);

  useEffect(() => {
    web3AuthInit();
  }, []);

  useEffect(() => {
    const fetchUserDal = async () => {
      const balance = await getDal();
      setUserDal(balance);
    };
    fetchUserDal();
  }, [getDal]);

  const login = async (): Promise<void> => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
    } else {
      await web3auth.connect();
    }
  };

  const LoggedInView = (
    <>
      <div className="flex-container">
        <table border={1}>
          <thead></thead>
          <tbody>
            <tr>
              <td>이메일</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>이름</td>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <td>지갑 주소</td>
              <td>{user?.walletAddress}</td>
            </tr>
            <tr>
              <td>보유 DAL 확인</td>
              <td>{userDal}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const UnloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="Login">
      <img src="/src/assets/images/duzzle logo.png" />
      <div className="grid">
        {duzzleLoggedIn ? LoggedInView : UnloggedInView}
      </div>
    </div>
  );
}

export default Login;
