import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Quest.css";
import { AcidRainQuestData } from "./Acid/Acid.types";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

function Quest() {
  const nav = useNavigate();
  const [type, setQuizType] = useState("");
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const startQuiz = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (
          confirm(
            "비회원일 경우 DAL 토큰을 지급받을 수 없습니다. 로그인을 해주세요."
          )
        ) {
          nav("/login");
        }
      }
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
      console.log("POST 성공", response.data);
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
      console.error("Error fetching random quiz:", error);
      // API 연결이 안될 시
      setQuizType("SPEED_QUIZ");
      // nav("/questspeed");
    }
  };

  return (
    <div className="Quest">
      <div className="random"> RANDOM QUEST</div>
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
      <button className="btn-hover color-6" onClick={startQuiz}>
        START
      </button>
      <MyBottomNavBar />
    </div>
  );
}

export default Quest;
