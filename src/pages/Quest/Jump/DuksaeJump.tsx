import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./DuksaeJump.css";

function DuksaeJump() {
  const location = useLocation();
  const {
    objectSpeed,
    objectMaxSpeed,
    speedIncreaseRate,
    speedIncreaseInterval,
    gameoverLimit,
    passingScore,
  } = location.state;

  const [speed, setSpeed] = useState(objectSpeed);
  const [health, setHealth] = useState(gameoverLimit);
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [obstacleType, setObstacleType] = useState("tree");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: {
        logId: location.pathname.split("/").pop(),
        gamePanelOffsetWidth: 550,
      },
    });

    socket.emit("quest:duksae-jump:start", {
      logId: location.pathname.split("/").pop(),
      gamePanelOffsetWidth: 550,
    });

    socket.on("speed", (newSpeed) => {
      setSpeed(newSpeed);
    });

    socket.on("health", (newHealth) => {
      setHealth(newHealth);
    });

    socket.on("score", (newScore) => {
      setScore(newScore);
    });

    socket.on("object", (objectType) => {
      // 장애물 종류를 설정
      setObstacleType(objectType);
    });

    socket.on("gameover", (finalScore) => {
      alert(`게임 종료! 최종 점수: ${finalScore}`);
      socket.disconnect();
    });

    socket.on("result", (result) => {
      alert(`게임 성공! 최종 점수: ${result.score}`);
      socket.disconnect();
    });

    const interval = setInterval(() => {
      setSpeed((prevSpeed) =>
        Math.max(prevSpeed * speedIncreaseRate, objectMaxSpeed)
      );
    }, speedIncreaseInterval);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [location.state]);

  // 스페이스바 눌렀을 때 점프 처리
  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !jumping) {
        setJumping(true);
        setTimeout(() => {
          setJumping(false);
        }, 500); // 500ms 동안 점프
      }
    };
    window.addEventListener("keydown", handleJump);
    return () => {
      window.removeEventListener("keydown", handleJump);
    };
  }, [jumping]);

  return (
    <div className="QuestJump">
      <div className="info">
        <div>목숨: {health} ❤️</div>
        <div>점수: {score}</div>
        <div>속도: {speed.toFixed(2)}</div>
      </div>
      <div className="game-panel">
        <div className={`dino ${jumping ? "jump" : ""}`} />{" "}
        <div className={`obstacle ${obstacleType}`} /> {/* 장애물 */}
      </div>
    </div>
  );
}

export default DuksaeJump;
