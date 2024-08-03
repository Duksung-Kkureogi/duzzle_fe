import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Mypage.css";
import { useAuth } from "../../services/AuthContext";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

function Mypage() {
  const { getDal, logout } = useAuth();
  const navigate = useNavigate();
  const [userDal, setUserDal] = useState(0);

  interface UserInfo {
    email: string;
    name: string;
    image: string;
    totalItems: number;
    totalPieces: number;
  }
  const [user, setUser] = useState<UserInfo>({
    name: "",
    image: "",
    email: "",
    totalItems: 0,
    totalPieces: 0,
  });

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const web3LoggedIn = localStorage.getItem("web3LoggedIn");
    const duzzleLoggedIn = localStorage.getItem("duzzleLoggedIn");

    const checkLoggedIn = async () => {
      if (web3LoggedIn != "true" || duzzleLoggedIn != "true" || !token) {
        alert("로그인이 필요합니다.\n로그인 화면으로 이동합니다.");
        navigate("/login");
        return;
      }
    };

    const getUserInfo = async () => {
      try {
        const response = await axios.get(RequestUrl + "/v1/user", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        if (response.data.result) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch userInfo");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserDal = async () => {
      const balance = await getDal();
      setUserDal(balance);
    };

    const fetchData = async () => {
      await checkLoggedIn();
      await Promise.all([getUserInfo(), fetchUserDal()]);
    };

    fetchData();
  }, [RequestUrl, getDal, navigate]);

  const Logout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
    }
    console.log("logged out");
  };

  return (
    <div className="Mypage">
      <p className="logout" onClick={Logout}>
        로그아웃
      </p>
      <div className="user_image">
        <img src={user.image} />
      </div>
      <div className="user_info">
        <p className="user_name">{user.name}</p>
        <p className="user_email">{user.email}</p>
      </div>
      <div className="user_dal">
        <img src="/src/assets/images/moon.png" />
        <p>{userDal} Dal</p>
      </div>

      <div className="user_menu">
        <section className="user_profile" onClick={() => navigate("/profile")}>
          <p>프로필</p>
        </section>
        <section className="user_nft">
          <div className="nft_items" onClick={() => navigate("/mypage/items")}>
            <img src="/src/assets/images/item.png" />
            <p>{user.totalItems} Items</p>
          </div>
          <div
            className="nft_pieces"
            onClick={() => navigate("/mypage/pieces")}
          >
            <img src="/src/assets/images/piece.png" />
            <p>{user.totalPieces} Pieces</p>
          </div>
        </section>
        <section className="user_setting" onClick={() => navigate("/setting")}>
          <p>설정</p>
        </section>
      </div>
      <MyBottomNavBar />
    </div>
  );
}

export default Mypage;
