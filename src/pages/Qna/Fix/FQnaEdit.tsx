import { useNavigate, useParams } from "react-router-dom";
import MyButton from "../../../components/MyButton";
import MyHeader from "../../../components/MyHeader";
import Button from "./Button";
import FQnaEditor from "./FQnaEditor";
import { useEffect, useState } from "react";
import axios from "axios";

import "./FQnaEdit.css";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

const FQnaEdit = () => {
  const params = useParams();
  const questionId = params.id;
  const [sortType, setSortType] = useState("거래");
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState("naver.com");
  const [content, setContent] = useState("");
  const [initData, setInitData] = useState({
    sortType,
    email,
    emailType,
    content,
  });
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("GET 성공", response);
      // 혜림님 코드
  //     setSortType(response.data["data"]["category"]);
  //     const emailArr = response.data["data"]["email"].split("@");
  //     setEmail(emailArr[0]);
  //     setEmailType(emailArr[1]);
  //     setContent(response.data["data"]["question"]);
  //     // setInitData가 제대로 안됨..
  //     setInitData({
  //       sortType: sortType,
  //       email: email,
  //       emailType: emailType,
  //       content: content,
  //     });
  //     console.log(initData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // 수정
  const data = response.data.data; 
  setInitData({
    sortType: data.category,
    email: data.email.split("@")[0],
    emailType: data.email.split("@")[1],
    content: data.question,
  });
} catch (error) {
  console.error(error);
}
}
//

  async function onDelete(questionId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("DELETE 성공", response);
    } catch (error) {
      console.error(error);
    }
  }

  const onSort = (value) => {
    if (value === "거래") return "MARKET";
    else if (value === "계정") return "ACCOUNT";
    else if (value === "퀘스트") return "QUEST";
    else if (value === "스토리") return "STORY";
    else if (value === "기타") return "ETC";
  };

  async function onUpdate(
    questionId,
    submitTime,
    sortType,
    email,
    emailType,
    content
  ) {
    try {
      const category = onSort(sortType);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          category: category,
          email: email + "@" + emailType,
          question: content,
          submitTime: submitTime,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PUT 성공", response.data);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  }

  const onClickDelete = () => {
    if (window.confirm("문의를 정말 삭제하시겠습니까?")) {
      onDelete(questionId);
      nav("/qna");
    }
  };

  const onSubmit = (input) => {
    if (window.confirm("문의를 수정하시겠습니까?")) {
      onUpdate(
        questionId,
        new Date().getTime(),
        input.sortType,
        input.email,
        input.emailType,
        input.content
      );
      nav("/qna");
    }
  };

  return (
    <>
      <div className="QnaEdit">
        <MyHeader headerText="문의 수정하기" leftChild={<MyButton />} />
        <FQnaEditor initData={initData} onSubmit={onSubmit} />
      </div>
      <section className="button_section">
        <Button text={"삭제하기"} onClick={onClickDelete} />
      </section>
    </>
  );
};

export default FQnaEdit;
