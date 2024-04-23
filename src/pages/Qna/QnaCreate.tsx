import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import QnaCreateEdior from "./QnaCreateEditor";
import { useContext } from "react";
import { DiaryDispatchContext } from "../../App";
import { useNavigate } from "react-router-dom";

function QnaCreate() {
    const nav = useNavigate();
    const {onCreate} = useContext(DiaryDispatchContext);
    const onSubmit = (updatedInput) => {
        onCreate(
            updatedInput.submitTime, 
            updatedInput.sortType, 
            updatedInput.emailType, 
            updatedInput.emailType2,
            updatedInput.content
        );
        nav('/qna',{replace: true});
    };
    
    return(
    <div className="QnaCreate">
        <MyHeader headerText="새 문의쓰기" leftChild={<MyButton />} />
        <QnaCreateEdior onSubmit={onSubmit}/>
    </div>
    );
}

export default QnaCreate;