import { useNavigate, useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";

import "./HistorySeason.css";

function HistorySeason() {
  const { seasonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="HistorySeason">
      <MyHeader headerText="히스토리" leftChild={<MyButton />} />
      <p>{seasonId}</p>
      <button onClick={() => navigate(`/history/${seasonId}/puzzle`)}>
        퍼즐 히스토리
      </button>
      <button onClick={() => navigate(`/history/${seasonId}/ranking`)}>
        랭킹 히스토리
      </button>
    </div>
  );
}

export default HistorySeason;
