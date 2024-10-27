import { useNavigate, useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";

import "./HistorySeason.css";

// 이미지
import puzzleImg from "./hs_puzzle.png";
import rankingImg from "./hs_ranking.png";

function HistorySeason() {
  const { seasonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="HistorySeason">
      <MyHeader headerText="히스토리" leftChild={<MyButton />} />
      <div className="hs">
        <div className="hs_puzzle">
          <img src={puzzleImg} />
          <button onClick={() => navigate(`/history/${seasonId}/puzzle`)}>
            퍼즐 히스토리
          </button>
        </div>
        <div className="hs_ranking">
          <img src={rankingImg} />
          <button onClick={() => navigate(`/history/${seasonId}/ranking`)}>
            랭킹 히스토리
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistorySeason;
