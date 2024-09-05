import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DuksaeJump.css";
import { useWebSocket } from "../../../services/WebSocketContext";
import {
  ToastComponent,
  ToastProps,
  ToastType,
} from "../../../components/Toast";

const DuksaeJump: React.FC<DuksaeJumpProps> = ({ logId, data }) => {
  const { socket } = useWebSocket();
  const navigate = useNavigate();
  const {
    objectSpeed,
    objectMaxSpeed,
    speedIncreaseRate,
    speedIncreaseInterval,
    gameoverLimit,
    passingScore,
  } = data;

  const [speed, setSpeed] = useState(objectSpeed);
  const [health, setHealth] = useState(Math.max(0, gameoverLimit || 0));
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [obstacleType, setObstacleType] = useState("tree");
  const [gameover, setGameover] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [obstaclePassed, setObstaclePassed] = useState(false);

  const obstacleRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  useEffect(() => {
    console.log("WebSocket 연결 시도");

    socket.emit("quest:duksae-jump:start", {
      logId,
      gamePanelOffsetWidth: 550,
    });
    console.log("WebSocket: 'quest:duksae-jump:start' 이벤트 송신");

    socket.on("speed", (speed) => {
      console.log("WebSocket: 'speed' 이벤트 수신", speed);
      setSpeed(speed);
    });

    socket.on("health", (newHealth) => {
      const validHealth = Math.max(0, newHealth || 0);
      console.log("WebSocket: 'health' 이벤트 수신", validHealth);
      setHealth(validHealth);
      showToast(
        `Health: ${new Array(validHealth).fill("❤️").join("")}`,
        ToastType.Warning
      );
    });

    socket.on("score", (newScore) => {
      console.log("WebSocket: 'score' 이벤트 수신", newScore);
      setScore(newScore);
      showToast(`Score: ${newScore}`, ToastType.Info);
    });

    socket.on("object", (newObstacleType) => {
      console.log("WebSocket: 'object' 이벤트 수신", newObstacleType);
      setObstacleType(newObstacleType);
      setObstaclePassed(false);
    });

    socket.on("gameover", (finalScore) => {
      console.log("WebSocket: 'gameover' 이벤트 수신", finalScore);
      setGameover(true);
      setScore(finalScore);
      setIsSucceeded(false);
      showToast(`Game Over! Score: ${finalScore}`, ToastType.Error);
    });

    socket.on("result", (result) => {
      console.log("WebSocket: 'result' 이벤트 수신", result);
      setScore(result.score);
      setGameover(true);
      setIsSucceeded(result.result);
      showToast(`Success! Score: ${result.score}`, ToastType.Success);
    });

    const collisionInterval = setInterval(() => {
      if (!gameover && detectCollision()) {
        console.log("충돌 발생! 점수 감소");
        setScore((prevScore) => Math.max(0, prevScore - 1));
        setHealth((prevHealth) => Math.max(0, prevHealth - 1));
        if (health <= 0) {
          setGameover(true);
          socket.emit("quest:duksae-jump:gameover", score);
        }
      }
    }, 100);

    const speedInterval = setInterval(() => {
      setSpeed((prevSpeed) => {
        const newSpeed = prevSpeed + speedIncreaseRate;
        console.log("속도 증가:", newSpeed);
        return Math.min(newSpeed, objectMaxSpeed);
      });
    }, speedIncreaseInterval);

    return () => {
      console.log("WebSocket 연결 해제");
      clearInterval(collisionInterval);
      clearInterval(speedInterval);
      socket.disconnect();
    };
  }, [
    logId,
    socket,
    speedIncreaseRate,
    objectMaxSpeed,
    speedIncreaseInterval,
    showToast,
    gameover,
    health,
    score,
  ]);

  const detectCollision = () => {
    if (!obstacleRef.current || !dinoRef.current) {
      console.log("장애물 또는 캐릭터를 찾지 못함");
      return false;
    }

    const dinoRect = dinoRef.current.getBoundingClientRect();
    const obstacleRect = obstacleRef.current.getBoundingClientRect();

    console.log("캐릭터 위치:", dinoRect);
    console.log("장애물 위치:", obstacleRect);

    const buffer = 10;

    const dinoLeft = dinoRect.left + buffer;
    const dinoRight = dinoRect.right - buffer;
    const dinoTop = dinoRect.top + buffer;
    const dinoBottom = dinoRect.bottom - buffer;

    const obstacleLeft = obstacleRect.left + buffer;
    const obstacleRight = obstacleRect.right - buffer;
    const obstacleTop = obstacleRect.top + buffer;
    const obstacleBottom = obstacleRect.bottom - buffer;

    const isCollision =
      dinoRight > obstacleLeft &&
      dinoLeft < obstacleRight &&
      dinoBottom > obstacleTop &&
      dinoTop < obstacleBottom;

    return isCollision;
  };

  useEffect(() => {
    const handleJump = (event: KeyboardEvent) => {
      if (event.code === "Space" && !jumping && !gameover) {
        console.log("점프 시작");
        setJumping(true);
        setObstaclePassed(false);

        setTimeout(() => {
          const isCollided = detectCollision();
          if (!isCollided) {
            console.log("장애물 넘기 성공, 점수 증가");
            setScore((prevScore) => prevScore + 1);
            socket.emit("quest:duksae-jump:success");
          } else {
            console.log("장애물 충돌, 점수 감소");
            setScore((prevScore) => Math.max(0, prevScore - 1));
          }
          setJumping(false);
        }, 500);
      }
    };

    window.addEventListener("keydown", handleJump);
    return () => {
      window.removeEventListener("keydown", handleJump);
    };
  }, [jumping, gameover, socket]);

  return (
    <div className="QuestJump">
      <div className="info">
        <div>Health: {new Array(health).fill("❤️").join("")}</div>
        <div>Score: {score}</div>
        <div>Speed: {speed.toFixed(2)}</div>
      </div>
      <div className="game-panel">
        <div className={`dino ${jumping ? "jump" : ""}`} ref={dinoRef} />
        <div className={`obstacle ${obstacleType}`} ref={obstacleRef} />
      </div>
      {gameover && (
        <div className="score">
          <div id="end-score">Score: {score}</div>
          <button
            className="restart"
            id="restart"
            onClick={() => navigate("/result")}
          >
            결과 확인
          </button>
        </div>
      )}
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  );
};

export default DuksaeJump;
