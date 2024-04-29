import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { web3auth } from "./Login";

import "./Mypage.css";

function Mypage() {
  const navigate = useNavigate();
  const [userName, SetUserName] = useState("");
  const [userEmail, SetUserEmail] = useState("");

  // const user_name = "DukDol";
  // const user_email = "DukDol@gmail.com";
  const user_dal = 24;
  const nft_items = 18;
  const nft_pieces = 7;

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    getData();
  }, []);

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
      SetUserName(response.data["data"]["name"] ?? "User");
      SetUserEmail(response.data["data"]["email"]);
    } catch (error) {
      console.error(error);
    }
  }

  const logout = async () => {
    // await web3auth.logout();
    console.log("logged out");
    navigate("/");
  };

  return (
    <div className="Mypage">
      <p className="logout" onClick={logout}>
        로그아웃
      </p>
      <div className="user_image">
        <img src="/src/assets/images/profileImg.png" />
      </div>
      <div className="user_info">
        <p className="user_name">{userName}</p>
        <p className="user_email">{userEmail}</p>
      </div>
      <div className="user_dal">
        <img src="/src/assets/images/moon.png" />
        <p>{user_dal} Dal</p>
      </div>

      <div className="user_menu">
        <section className="user_profile" onClick={() => navigate("/profile")}>
          <p>프로필</p>
        </section>
        <section className="user_nft">
          <div className="nft_items">
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
