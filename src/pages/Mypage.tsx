import { useNavigate } from "react-router-dom";

function Mypage() {
  const navigate = useNavigate();

  const user_name = "DukDol";
  const user_email = "DukDol@gmail.com";
  const user_dal = 24;

  return (
    <div className="Mypage">
      <section className="user_img">
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
          ></path>
        </svg>
      </section>
      <section className="user_info">
        <p className="user_name">{user_name}</p>
        <p className="user_email">{user_email}</p>
      </section>
      <section className="user_dal">
        <svg
          data-slot="icon"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          ></path>
        </svg>
        {user_dal} Dal
      </section>
      <section>
        <div className="user_menu">
          <button onClick={() => navigate("/profile")}>프로필</button>

          <button onClick={() => navigate("/setting")}>설정</button>
        </div>
      </section>
    </div>
  );
}

export default Mypage;
