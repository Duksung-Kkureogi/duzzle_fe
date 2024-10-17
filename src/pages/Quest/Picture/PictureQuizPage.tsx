import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestApis } from "../../../services/api/quest.api";

const PictureQuizPage: React.FC = () => {
  //   const { isAuthenticated } = useAuth(); TODO: dev 에 반영되면 주석 해제
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const nav = useNavigate();
  const logId = useParams()?.logId;
  const [answer, setAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const images = localStorage.getItem("quest").split("{}");

  useEffect(() => {
    if (
      !logId ||
      !localStorage.getItem("quest") ||
      !localStorage.getItem("timeLimit") ||
      logId !== localStorage.getItem("logId")
    ) {
      nav("/notfound");
      return;
    }
    const timeLimit = parseInt(localStorage.getItem("timeLimit"));
    setTimeLeft(timeLimit);

    const timeLimitInSeconds = parseInt(localStorage.getItem("timeLimit"));
    setTimeLeft(timeLimitInSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [logId, nav]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const result = isAuthenticated
      ? await QuestApis.getResult({ logId: Number(logId), answer: [answer] })
      : await QuestApis.getResultForGuest({
          logId: Number(logId),
          answer: [answer],
        });
    if (result) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  }, [isAuthenticated, logId, answer, nav]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>이 장소의 이름은?</h1>
      <div style={{ fontSize: "24px", margin: "20px 0" }}>
        남은 시간: {formatTime(timeLeft)}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`퀴즈 이미지 ${index + 1}`}
            style={{ width: "150px", height: "150px" }}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={answer}
          onChange={handleInputChange}
          placeholder="장소 이름을 입력하세요"
        />
        <button onClick={handleSubmit}>정답 확인</button>
      </div>
    </div>
  );
};

export default PictureQuizPage;
