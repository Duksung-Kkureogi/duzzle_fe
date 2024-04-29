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
      <section className="user_firstrow">
        <img src="/src/assets/images/profileImg.png" />
        <p className="logout" onClick={logout}>
          로그아웃
        </p>
      </section>
      <section className="user_info">
        <p className="user_name">{userName}</p>
        <p className="user_email">{userEmail}</p>
      </section>
      <section className="user_dal">
        <img src="/src/assets/images/moon.png" />
        {user_dal} Dal
      </section>
      <section>
        <div className="user_menu">
          <span onClick={() => navigate("/profile")}>프로필</span>
          <div className="user_nft">
            <div className="nft_items">
              <img src="/src/assets/images/item.png" />
              <span>{nft_items} Items</span>
            </div>
            <div className="nft_pieces">
              <img src="/src/assets/images/piece.png" />
              <span>{nft_pieces} Pieces</span>
            </div>
          </div>
          <span onClick={() => navigate("/setting")}>설정</span>
        </div>
      </section>
    </div>
  );
}

export default Mypage;
