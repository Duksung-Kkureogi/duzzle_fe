import Button from "./Button";
import "./QnaItem.css";
import { useNavigate } from "react-router-dom";

const QnaItem = ({ id, submitTime, sortType, emailId, content }) => {
    const nav = useNavigate()

    return (
        <div className="QnaItem">
            <div onClick={() => nav(`/qnadiary/${id}`)} className="infor_section">
                <div className="content">
                    {content}
                </div>
                <div className="created_date">
                    등록일 {new Date(submitTime).toLocaleDateString()}
                </div>
            </div>
            <div className="answer_section">답변대기</div>
            <div className="button_section">
                <Button onClick={() => nav(`/qnaedit/${id}`)} text={"수정하기"} />
            </div>
        </div>
    )
}

export default QnaItem;
