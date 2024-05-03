import { useNavigate } from "react-router-dom";
import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import QnaList from "./QnaList";
import { useState, useContext } from "react";
import { DiaryStateContext } from "../../App";
import "./Qna.css";

function Qna() {
  const data = useContext(DiaryStateContext);
  const navigate = useNavigate();

  return (
    <div className="Qna">
      <MyHeader headerText="1:1 문의하기" leftChild={<MyButton />} />
      <div className="Qna_wrapper">
        <QnaList data={data} />
      </div>
    </div>
  );
}

export default Qna;
