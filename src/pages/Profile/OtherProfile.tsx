import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

import "./OtherProfile.css";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useParams } from "react-router-dom";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

function OtherProfile() {
  const { walletAddress } = useParams();
  const [image, setImage] = useState("");
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          RequestURL + `/v1/user/${walletAddress}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("GET 성공", response);
        setProfile(response);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [walletAddress]);

  async function setProfile(response: AxiosResponse) {
    setWallet(response.data["data"]["walletAddress"]);
    setName(response.data["data"]["name"] ?? "Anonymous");
    setEmail(response.data["data"]["email"]);
    setImage(response.data["data"]["image"]);
    setTotalItems(response.data["data"]["totalItems"]);
    setTotalPieces(response.data["data"]["totalPieces"]);
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
        <div className="profile_total">
          <div className="profile_items">
            <p className="list_name">총 아이템 개수</p>
            <div className="items">
              <p>{totalItems}개</p>
            </div>
          </div>
          <div className="profile_pieces">
            <p className="list_name">총 조각 개수</p>
            <div className="pieces">
              <p>{totalPieces}개</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
