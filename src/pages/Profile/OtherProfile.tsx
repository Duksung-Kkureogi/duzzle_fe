import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

import "./OtherProfile.css";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

function OtherProfile() {
  const [image, setImage] = useState("");
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const level = "Lv.1";
  const achievement = "2022 #Summer Duksung Lv.8";

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(RequestURL + "/v1/user", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        console.log("GET 성공", response);
        setProfile(response);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  async function setProfile(response: AxiosResponse) {
    setWallet(response.data["data"]["walletAddress"]);
    setName(response.data["data"]["name"] ?? "Anonymous");
    setEmail(response.data["data"]["email"]);
    setImage(response.data["data"]["image"]);
  }

  return (
    <div className="OtherProfile">
      <MyHeader headerText="프로필" leftChild={<MyButton />} />
      <div className="profile_title">
        <p>사용자 정보</p>
      </div>
      <div className="profile_img">
        <img src={image} />
      </div>
      <div className="profile_list">
        <section className="profile_wallet">
          <p className="list_name">지갑 주소</p>
          <div className="wallet">
            <p>{wallet}</p>
          </div>
        </section>
        <section className="profile_name">
          <p className="list_name">이름(닉네임)</p>
          <div className="name">
            <p>{name}</p>
          </div>
        </section>
        <section className="profile_email">
          <p className="list_name">이메일</p>
          <div className="email">
            <p>{email}</p>
          </div>
        </section>
        <section className="profile_grade">
          <p className="list_name">등급</p>
          <div className="level">
            <p>{level}</p>
          </div>
        </section>
        <section className="profile_achievement">
          <p className="list_name">업적</p>
          <div className="achievement">
            <p>{achievement}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OtherProfile;
