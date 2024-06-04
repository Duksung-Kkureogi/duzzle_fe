import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Mypage.css";
import { useAuth } from "../../services/AuthContext";

function Mypage() {
  const { web3auth, getDal, web3AuthInit, logout } = useAuth();
  const navigate = useNavigate();
  const [userDal, setUserDal] = useState(0);
  interface UserInfo {
    email: string;
    name: string;
    image: string;
  }
  const [user, setUser] = useState<UserInfo>({
    name: "",
    image: "",
    email: "",
  });
  const [nftItems, setNftItems] = useState(0);
  const [nftPieces, setNftPieces] = useState(0);

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    if (!web3auth) {
      web3AuthInit();
    }
  }, [web3auth, web3AuthInit]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(RequestUrl + "/v1/user", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (response.data.result) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch userInfo");
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getUserItems = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(RequestUrl + "/v1/my/nft-items", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(response);
        if (response.data.result) {
          setNftItems(response.data.data.totalItems);
        } else {
          console.error("Failed to fetch user items");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
    getUserItems();
  }, [RequestUrl]);

  useEffect(() => {
    const fetchUserDal = async () => {
      const balance = await getDal();
      setUserDal(balance);
    };
    fetchUserDal();
  }, [getDal]);

  const Logout = () => {
    logout;
    console.log("logged out");
    navigate("/");
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
            <p>{nftItems} Items</p>
          </div>
          <div
            className="nft_pieces"
            onClick={() => navigate("/mypage/pieces")}
          >
            <img src="/src/assets/images/piece.png" />
            <p>{nftPieces} Pieces</p>
          </div>
        </section>
        <section className="user_setting" onClick={() => navigate("/setting")}>
          <p>설정</p>
        </section>
      </div>
    </div>
  );
}

export default Mypage;
