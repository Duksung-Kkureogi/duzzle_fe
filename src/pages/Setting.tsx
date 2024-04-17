import { useNavigate } from "react-router-dom";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

function Setting() {
  const navigate = useNavigate();

  return (
    <div className="Setting">
      <MyHeader headerText="설정" leftChild={<MyButton />} />
      <div>
        <p>나의 설정</p>
      </div>
      <div>
        <button onClick={() => navigate("/faq")}>자주하는 질문(FAQ)</button>
        <button onClick={() => navigate("/qna")}>1:1 문의하기</button>
        <button>커뮤니티</button>
      </div>
    </div>
  );
}

export default Setting;
