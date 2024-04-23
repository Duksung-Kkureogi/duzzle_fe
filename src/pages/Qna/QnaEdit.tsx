import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import { useParams,useNavigate } from "react-router-dom";
import QnaCreateEdior from "./QnaCreateEditor";
import Button from "./Button";
import { useContext, useEffect, useState } from "react";
import { DiaryDispatchContext, DiaryStateContext } from "../../App";
import QnaUse from "./QnaUse";


function QnaEdit() {
    const params = useParams()
    const nav = useNavigate()
    const {onDelete, onUpdate} = useContext(DiaryDispatchContext)
    const curDiaryItem = QnaUse(params.id)

    const onClickDelete = ()=>{
        if(
            window.confirm("문의를 정말 삭제하시겠습니까?")
        ){
            onDelete(params.id);
            nav('/qna', {replace: true});
        } 
    };
    const onSubmit = (input) =>{
        if (window.confirm("문의를 수정하시겠습니까?")){
            onUpdate(
                params.id,
                new Date().getTime(), 
                input.sortType, 
                input.emailType, 
                input.emailType2,
                input.content
            );
            nav("/qna", {replace: true});
        }
    };

    return(
    <>
        <div className="QnaEdit">
            <MyHeader headerText="문의 수정하기" leftChild={<MyButton />}/>
            {/* <div>{params.id}번 문의 수정페이지</div> */}
            <QnaCreateEdior initData = {curDiaryItem} onSubmit={onSubmit}/>
        </div>
        <section className="button_section">
            <Button text={"삭제하기"} onClick={onClickDelete}/>
        </section>
    </>    
    );
}

export default QnaEdit;