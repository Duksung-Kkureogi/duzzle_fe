import { useEffect, useRef, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import axios, { AxiosResponse, isAxiosError } from "axios";

import "./Profile.css";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

function Profile() {
  const [image, setImage] = useState("");
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState("");
  const level = "Lv.4";
  const achievement = `2022 #Summer Duksung Lv.8
    2023 #Spring Duksung Lv.9 
    2023 #Autumn Duksung Lv.10`;

  const [isEditingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [isEditingImg, setEditingImg] = useState(false);
  const ImgInput = useRef<HTMLInputElement | null>(null);

  const [isEditingType, setEditingType] = useState(false);

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

    const setProfile = async (response: AxiosResponse) => {
      setWallet(response.data["data"]["walletAddress"]);
      setName(response.data["data"]["name"] ?? "Anonymous");
      setEmail(response.data["data"]["email"]);
      setImage(response.data["data"]["image"]);
      setProfileType(response.data["data"]["profileType"]);
    };

    getData();
  }, [isEditingName, isEditingImg, isEditingType]);

  // 유저 이름 변경
  const onNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedName(e.target.value);
  };

  const onEditName = async () => {
    const ok = confirm("이름을 바꾸시겠습니까?");
    if (!ok) return;
    try {
      await patchName(editedName);
    } catch (error) {
      console.error(error);
    }
    setEditingName(false);
    setEditedName("");
  };

  async function patchName(new_name: string) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        RequestURL + "/v1/user/name",
        { name: new_name },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PATCH 성공", response);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        if (error.response?.data.code == "ALREADY_EXISTS") {
          alert("동일한 이름이 존재합니다.\n다른 이름을 입력해주세요.");
        } else if (error.response?.data.code == "LIMIT_EXCEEDED") {
          alert(
            "이름 변경은 10분 간격으로 가능합니다.\n잠시 후에 시도해주세요."
          );
        }
      }
    }
  }

  // 유저 프로필 이미지 변경
  async function onUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      for (const key of formData.keys()) {
        console.log(key, ":", formData.get(key));
      }
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        RequestURL + "/v1/user/image",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("PATCH 성공", response);
      setEditingImg(false);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        if (error.response?.data.code == "FILE_NAME_EXTENSION") {
          alert("지원되지 않는 파일 형식입니다.");
        } else if (error.response?.data.code == "FILE_NAME_CHARACTERS") {
          alert("파일명에 특수문자를 포함할 수 없습니다.");
        }
      }
    }
  }

  const handleClick = () => {
    if (!ImgInput.current) {
      return;
    }
    ImgInput.current.click();
    setEditingImg(true);
  };

  // 유저 프로필 공개여부 설정
  async function patchProfileType(type: string) {
    const ok = confirm("프로필 공개여부를 바꾸시겠습니까?");
    if (!ok) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        RequestURL + "/v1/user/profileType",
        { profileType: type },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PATCH 성공", response);
      setEditingType(false);
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
        <button onClick={handleClick}>
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
          <input
            type="file"
            accept="image/*"
            name="userImg"
            ref={ImgInput}
            onChange={onUploadImg}
            style={{ display: "none" }}
          />
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
            {isEditingName ? (
              <textarea onChange={onNameChange} placeholder={name} />
            ) : (
              <p>{name}</p>
            )}
            {isEditingName ? (
              <>
                {editedName.length > 0 ? (
                  <button className="done" onClick={onEditName}>
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
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => setEditingName(false)}>
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
                        d="M6 18 18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <button className="edit" onClick={() => setEditingName(true)}>
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
            )}
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
        <section className="profile_type">
          <p className="list_name">
            프로필<br></br>공개여부
          </p>
          <div className="type">
            {isEditingType ? (
              <>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("PUBLIC")}
                >
                  public<br></br>모두에게 공개
                </button>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("PRIVATE")}
                >
                  private<br></br>유저에게 공개
                </button>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("NONE")}
                >
                  none<br></br>비공개
                </button>
                <button className="edit" onClick={() => setEditingType(false)}>
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
                      d="M6 18 18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <p>{profileType}</p>
                <button className="edit" onClick={() => setEditingType(true)}>
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
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
