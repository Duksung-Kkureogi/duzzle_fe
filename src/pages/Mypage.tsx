import { useNavigate } from "react-router-dom";

function Mypage() {
  const navigate = useNavigate();

  return (
    <div className="Mypage">
      <section>
        <h1>마이페이지(작업중..)</h1>
      </section>
      <section>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
          ></path>
        </svg>
      </section>
      <section>
        <p>Dukdol</p>
        <p>Dukdol@gmail.com</p>
      </section>
      <section>
        <button onClick={() => navigate("/profile")}>프로필</button>
        <button onClick={() => navigate("/setting")}>설정</button>
      </section>
    </div>
  );
}

export default Mypage;
