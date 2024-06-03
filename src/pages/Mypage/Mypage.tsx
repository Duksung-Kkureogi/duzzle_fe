import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Mypage.css";
import { useAuth } from "../../services/AuthContext";

function Mypage() {
  const { web3auth, getDal, web3AuthInit, logout } = useAuth();
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDal, setUserDal] = useState(0);

  const nft_items = 18;
  const nft_pieces = 7;

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    if (!web3auth) {
      web3AuthInit();
    }
  }, [web3auth, web3AuthInit]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const fetchUserDal = async () => {
      const balance = await getDal();
      setUserDal(balance);
    };
    fetchUserDal();
  }, [getDal]);

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(RequestUrl + "/v1/user", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setUserImg(response.data["data"]["image"]);
      setUserName(response.data["data"]["name"] ?? "User");
      setUserEmail(response.data["data"]["email"]);
    } catch (error) {
      console.error(error);
    }
  }

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
        <img src={userImg} />
      </div>
      <div className="user_info">
        <p className="user_name">{userName}</p>
        <p className="user_email">{userEmail}</p>
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
            <p>{nft_items} Items</p>
          </div>
          <div className="nft_pieces">
            <img src="/src/assets/images/piece.png" />
            <p>{nft_pieces} Pieces</p>
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
