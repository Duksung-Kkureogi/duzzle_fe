import { useNavigate } from "react-router-dom";
import "./QuestSuccess.css";
function QuestSuccess() {

    const nav = useNavigate();

    return (
    <div className="Questsuccess">
        퀘스트 성공페이지
        <button onClick={() => nav("/store")}>상점에서 재료 NFT 구입</button>
    </div>
    );
}
export default QuestSuccess;