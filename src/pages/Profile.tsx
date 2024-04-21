import { useEffect, useState } from "react";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";
import axios from "axios";

function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [image, setImage] = useState("/src/assets/images/profileImg.png");
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [level, setLevel] = useState("Lv.4");
  const achievement = `2022 #Summer Duksung Lv.8
    2023 #Spring Duksung Lv.9 
    2023 #Autumn Duksung Lv.10`;

  const [newName] = useState("new User");

  useEffect(() => {
    getData();
  });

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://duzzle-dev-env.eba-tesapmjt.ap-northeast-2.elasticbeanstalk.com/v1/user",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setWallet(response.data["data"]["walletAddress"]);
      setName(response.data["data"]["name"] ?? "User");
      setEmail(response.data["data"]["email"]);
    } catch (error) {
      console.error(error);
    }
  }

  async function patchData(new_name: string) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        "http://duzzle-dev-env.eba-tesapmjt.ap-northeast-2.elasticbeanstalk.com/v1/user/name",
        { name: new_name },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setName(response.data["data"]["name"]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="Profile">
      <MyHeader headerText="프로필" leftChild={<MyButton />} />
      <div className="profile_title">
        <p>나의 정보</p>
      </div>
      <div className="profile_img">
        <img src={image} />
        <button>
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.7"
            stroke="#ffffff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            ></path>
          </svg>
        </button>
      </div>
      <div className="profile_list_title">
        <p>개인정보</p>
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
            <button onClick={() => patchData(newName)}>
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="2.0"
                stroke="rgba(0, 0, 0, 0.3)"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                ></path>
              </svg>
            </button>
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

export default Profile;
