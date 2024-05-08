import { useNavigate } from "react-router-dom";
import "./QuestFail.css";
function QuestFail() {
    const nav = useNavigate();

    return (
    <div className="Questfail">
        <div className="text">
            <div className="text_fail">퀘스트 실패</div>
            <div className="text_good">다음에는 더 잘할 수 있어요!</div>
        </div>
        <div className="img_moon">
            <img src="/src/assets/cringmoon.png"/>
        </div>
        <div className="buttons">
            <button className="btn-hover color-1" onClick={() => nav("/story")}>스토리로 공부하기</button>
            <button className="btn-hover color-2" onClick={() => nav("/QuestSpeed")}>퀘스트 재도전!</button>
        </div>
    </div>
    );
}
export default QuestFail;