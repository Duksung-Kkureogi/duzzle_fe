import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>홈페이지(작업중..)</h1>
      <body>
        <button onClick={() => navigate("/login")}>로그인페이지로 가기</button>
        <button onClick={() => navigate("/mypage")}>마이페이지로 가기</button>
        <button onClick={() => navigate("/quest")}>퀘스트페이지로 가기</button>
      </body>
    </div>
  );
}

export default Home;
