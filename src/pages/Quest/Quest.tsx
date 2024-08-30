import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Quest.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

function Quest() {
  const nav = useNavigate();
  const [type, setQuizType] = useState("");
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const startQuiz = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        RequestURL + "/v1/quest/start",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Quest POST 성공", response.data);
      if (response.data.data.type === "SPEED_QUIZ") {
        localStorage.setItem("logId", response.data.data.logId);
        localStorage.setItem("quest", response.data.data.quest);
        localStorage.setItem("timeLimit", response.data.data.timeLimit);
        nav("/questspeed");
      } else if (response.data.data.type === "ACID_RAIN") {
        const quest: AcidRainQuestData = JSON.parse(response.data.data.quest);
        const queryParms = Object.entries(quest)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        nav(`/questacid/${response.data.data.logId}?`.concat(queryParms));
      }
      setQuizType(response.data.data.type);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("모든 퀘스트 완료 => 409 오류");
        alert("모든 퀘스트를 완료하였습니다. 최고에요!");
      } else {
        console.error("Error submitting result:", error);
      }
      setQuizType("SPEED_QUIZ");
    }
  };

  return (
    <div className="Quest">
      <div className="random"> 랜덤 게임</div>
      <div id="wrap">
        <div className="dice">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </div>
      </div>
      <button className="quest_button" onClick={startQuiz}>
        START
      </button>
      <MyBottomNavBar />
    </div>
  );
}

export default Quest;
