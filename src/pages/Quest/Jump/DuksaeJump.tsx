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
  const navigate = useNavigate();
  const {
    objectSpeed,
    objectMaxSpeed,
    speedIncreaseRate,
    speedIncreaseInterval,
    gameoverLimit,
    passingScore,
  } = data;

  const { socket } = useWebSocket();
  const [speed, setSpeed] = useState(objectSpeed / 15);
  const [health, setHealth] = useState(Math.max(0, gameoverLimit || 0));
  const [jumping, setJumping] = useState(false);
  const [obstacleType, setObstacleType] = useState("tree");
  const [gameover, setGameover] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [score, setScore] = useState(0); // score => distance 값
  const [isColliding, setIsColliding] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // 충돌 감지
  const detectCollision = () => {
    if (!obstacleRef.current || !dinoRef.current) return false;

    const dinoRect = dinoRef.current.getBoundingClientRect();
    const obstacleRect = obstacleRef.current.getBoundingClientRect();
    const buffer = 10;
    const isCollision =
      dinoRect.right - buffer > obstacleRect.left + buffer &&
      dinoRect.left + buffer < obstacleRect.right - buffer &&
      dinoRect.bottom - buffer > obstacleRect.top + buffer &&
      dinoRect.top + buffer < obstacleRect.bottom - buffer;
    return isCollision;
  };

  // 장애물 이동
  const moveObstacle = useCallback(() => {
    if (obstacleRef.current && !gameover) {
      const obstacle = obstacleRef.current;
      let obstacleX = obstacle.offsetLeft;
      if (obstacleX <= 0) {
        // showToast("점프 성공!", ToastType.Success);
        obstacleX = window.innerWidth;
      }

      obstacle.style.left = `${obstacleX - speed}px`;
    }
  }, [speed, gameover]);

  // 게임 루프 및 충돌 처리
  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      moveObstacle();
      if (!gameover && !isColliding && detectCollision()) {
        setIsColliding(true);
        setHealth((prevHealth) => {
          const newHealth = Math.max(0, prevHealth - 1);
          if (newHealth === 0) {
            setGameover(true);
          }
          return newHealth;
        });
        showToast("충돌!", ToastType.Error);
        setTimeout(() => {
          setIsColliding(false);
        }, 500);
      }
    }, 20);

    return () => clearInterval(gameLoopInterval);
  }, [moveObstacle, detectCollision, gameover, isColliding]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket.io 연결 성공", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.io 연결이 끊겼습니다.");
    });

    // 서버 이벤트 리스너
    socket.on("object", (newObstacleType: string) => {
      console.log("새로운 장애물:", newObstacleType);
      setObstacleType(newObstacleType);
    });

    socket.on("speed", (newSpeed: number) => {
      console.log("새로운 속도:", newSpeed);
      setSpeed(newSpeed);
    });

    socket.on("health", (remainingHealth: number) => {
      console.log("남은 목숨:", remainingHealth);
      setHealth(remainingHealth);
      showToast(
        `Health: ${new Array(remainingHealth).fill("❤️").join("")}`,
        ToastType.Warning
      );
    });

    socket.on("gameover", (finalScore: number) => {
      console.log("게임 오버, 최종 점수:", finalScore);
      setGameover(true);
      showToast(`Game Over! Total Score: ${finalScore} m`, ToastType.Error);
      handleResultPageNavigation();
    });

    socket.on("result", (resultData: { result: boolean; score: number }) => {
      console.log("게임 최종 결과:", resultData);
      setGameover(true);
      if (resultData.result) {
        showToast(
          `Success! Final Score: ${resultData.score}`,
          ToastType.Success
        );
      } else {
        showToast(`Failed! Final Score: ${resultData.score}`, ToastType.Error);
      }
      handleResultPageNavigation();
    });

    return () => {
      socket.off("object");
      socket.off("speed");
      socket.off("health");
      socket.off("gameover");
      socket.off("result");
      socket.disconnect();
    };
  }, [socket, showToast]);

  // 덕새 점프 퀘스트 시작 이벤트 전송
  useEffect(() => {
    socket.emit("quest:duksae-jump:start", {
      logId,
      gamePanelOffsetWidth: 550,
    });

    const speedInterval = setInterval(() => {
      setSpeed((prevSpeed) =>
        Math.min(prevSpeed * speedIncreaseRate, objectMaxSpeed)
      );
    }, speedIncreaseInterval);

    const scoreInterval = setInterval(() => {
      if (!gameover) {
        setScore((prevScore) => prevScore + 1000 / speed);
      }
    }, 100);

    return () => {
      clearInterval(speedInterval);
      clearInterval(scoreInterval);
    };
  }, [
    logId,
    socket,
    speedIncreaseRate,
    objectMaxSpeed,
    speedIncreaseInterval,
    gameover,
    speed,
  ]);

  // 게임 종료 후 결과 처리
  useEffect(() => {
    if (gameover) {
      if (score >= passingScore) {
        console.log("게임 종료 - 성공 조건 충족");
        socket.emit("quest:duksae-jump:success", { score }, () => {
          console.log("Success 메시지가 서버로 전송되었습니다.");
        });
      } else {
        console.log("게임 종료 - 실패 조건 충족");
        socket.emit("quest:duksae-jump:fail", { score }, () => {
          console.log("Fail 메시지가 서버로 전송되었습니다.");
        });
      }
    }
  }, [gameover, score, passingScore, logId, socket]);

  // 점프 및 스페이스바 이벤트 핸들러
  useEffect(() => {
    const handleJump = (event: KeyboardEvent | TouchEvent) => {
      const isTouchEvent = event.type === "touchstart";
      const isSpaceKey =
        !isTouchEvent && (event as KeyboardEvent).code === "Space";

      if ((isTouchEvent || isSpaceKey) && canJump && !gameover) {
        setJumping(true);
        setCanJump(false);

        const jumpDuration = 320;

        setTimeout(() => {
          setJumping(false);
          // setCanJump(true);
        }, jumpDuration);

        setTimeout(() => {
          setCanJump(true);
        }, jumpDuration + 100);
      }
    };

    window.addEventListener("keydown", handleJump);
    window.addEventListener("touchstart", handleJump);

    return () => {
      window.removeEventListener("keydown", handleJump);
      window.removeEventListener("touchstart", handleJump);
    };
  }, [jumping, gameover, canJump]);

  const handleResultPageNavigation = () => {
    if (score >= passingScore) {
      navigate("/questsuccess");
    } else {
      navigate("/questfail");
    }
  };

  return (
    <div className="QuestJump">
      <div className="info">
        {/* <div className="info_t">{passingScore}m를 달성하라</div> */}
      </div>
      <div className="game-panel">
        <span className="heart1">{new Array(health).fill("💛").join("")}</span>
        <span className="heart2"> {score.toFixed(2)} m</span>{" "}
        <div className={`dino ${jumping ? "jump" : ""}`} ref={dinoRef} />
        <div className={`obstacle ${obstacleType}`} ref={obstacleRef} />
      </div>
      <div className="info2">{/* <div>속도: {speed.toFixed(2)}</div> */}</div>

      {gameover && (
        <div className="score">
          <div id="distance1">Total Distance:</div>
          <div id="distance2">{score.toFixed(2)} m</div>
          <button
            className="restart4"
            id="restart4"
            onClick={handleResultPageNavigation}
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
