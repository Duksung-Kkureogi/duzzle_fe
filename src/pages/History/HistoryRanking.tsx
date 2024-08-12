import { useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";

import "./HistoryRanking.css";

function HistoryRanking() {
  const { seasonId } = useParams();

  return (
    <div className="HistoryRanking">
      <MyHeader headerText="히스토리" leftChild={<MyButton />} />
      <p>랭킹 히스토리 상세</p>
      <p>{seasonId}</p>
    </div>
  );
}

export default HistoryRanking;
