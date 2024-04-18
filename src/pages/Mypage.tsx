import { useNavigate } from "react-router-dom";

function Mypage() {
  const navigate = useNavigate();

  const user_name = "DukDol";
  const user_email = "DukDol@gmail.com";
  const user_dal = 24;
  const nft_items = 18;
  const nft_pieces = 7;

  return (
    <div className="Mypage">
      <section className="user_firstrow">
        <img src="/src/assets/images/dog.gif" />
        <p className="logout" onClick={() => alert("로그아웃하시겠습니까?")}>
          로그아웃
        </p>
      </section>
      <section className="user_info">
        <p className="user_name">{user_name}</p>
        <p className="user_email">{user_email}</p>
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
