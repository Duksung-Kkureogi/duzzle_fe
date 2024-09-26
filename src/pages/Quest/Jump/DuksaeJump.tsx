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
  const [obstaclePassed, setObstaclePassed] = useState(false);
  const [distance, setDistance] = useState(0);
  const [canJump, setCanJump] = useState(true);
  const [isColliding, setIsColliding] = useState(false);
  const [hasSentSuccess, setHasSentSuccess] = useState(false);
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
    if (obstacleRef.current) {
      const obstacle = obstacleRef.current;
      let obstacleX = obstacle.offsetLeft;
      if (obstacleX <= 0) {
        obstacleX = window.innerWidth;
      }

      obstacle.style.left = `${obstacleX - speed}px`;
    }
  }, [speed]);

  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      moveObstacle();
      if (!gameover && !isColliding && detectCollision()) {
        setIsColliding(true);
        setHealth((prevHealth) => {
          const newHealth = Math.max(0, prevHealth - 1);
          if (newHealth === 0 && prevHealth === 0) {
            setGameover(true);
            socket.emit("quest:duksae-jump:gameover");
          }
          return newHealth;
        });
        setTimeout(() => {
          setIsColliding(false);
        }, 500);
      }
    }, 20);

    return () => clearInterval(gameLoopInterval);
  }, [moveObstacle, detectCollision, gameover, isColliding, socket]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket.io 연결 성공", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.io 연결이 끊겼습니다.");
    });

    return () => {
      console.log("컴포넌트 언마운트 시 소켓 연결 해제");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("quest:duksae-jump:start", {
      logId,
      gamePanelOffsetWidth: 550,
    });

    socket.on("speed", (newSpeed) => {
      setSpeed(newSpeed);
    });

    socket.on("health", (newHealth) => {
      const validHealth = Math.max(0, newHealth || 0);
      setHealth(validHealth);
      showToast(
        `Health: ${new Array(validHealth).fill("❤️").join("")}`,
        ToastType.Warning
      );
    });

    socket.on("object", (newObstacleType) => {
      setObstacleType(newObstacleType);
      setObstaclePassed(false);
    });

    socket.on("gameover", () => {
      setGameover(true);
      showToast(
        `Game Over! Total Distance: ${distance.toFixed(2)} m`,
        ToastType.Error
      );
      handleResultPageNavigation();
    });

    socket.on("result", (result) => {
      setGameover(true);
      showToast(
        `Success! Final Distance: ${distance.toFixed(2)} m`,
        result.score >= passingScore ? ToastType.Success : ToastType.Error
      );
      handleResultPageNavigation();
    });

    const speedInterval = setInterval(() => {
      setSpeed((prevSpeed) =>
        Math.min(prevSpeed * speedIncreaseRate, objectMaxSpeed)
      );
    }, speedIncreaseInterval);

    const distanceInterval = setInterval(() => {
      if (!gameover) {
        setDistance((prevDistance) => prevDistance + 1000 / speed);
      }
    }, 100);

    return () => {
      clearInterval(speedInterval);
      clearInterval(distanceInterval);
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
    speed,
    passingScore,
    isColliding,
    distance,
  ]);

  useEffect(() => {
    const handleJump = (event: KeyboardEvent | TouchEvent) => {
      const isTouchEvent = event.type === "touchstart";
      const isSpaceKey =
        !isTouchEvent && (event as KeyboardEvent).code === "Space";

      if ((isTouchEvent || isSpaceKey) && canJump && !gameover) {
        setJumping(true);
        setObstaclePassed(false);
        setCanJump(false);

        const jumpDuration = 500;

        setTimeout(() => {
          const isCollided = detectCollision();

          if (!isCollided && !obstaclePassed) {
            setObstaclePassed(true);

            if (distance >= passingScore && !hasSentSuccess) {
              console.log(
                `Current distance: ${distance}, Passing score: ${passingScore}`
              );
              console.log("Passing score achieved, emitting success event");
              socket.emit("quest:duksae-jump:success", data, () => {
                console.log("메시지가 서버로 성공적으로 전송되었습니다.");
              });
              setHasSentSuccess(true);
            }
          }

          setJumping(false);
        }, jumpDuration);
      }
    };

    const handleKeyUp = (event: KeyboardEvent | TouchEvent) => {
      const isTouchEvent = event.type === "touchend";
      const isSpaceKey =
        !isTouchEvent && (event as KeyboardEvent).code === "Space";

      if (isTouchEvent || isSpaceKey) {
        setCanJump(true);
      }
    };

    window.addEventListener("keydown", handleJump);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleJump);
    window.addEventListener("touchend", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleJump);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleJump);
      window.removeEventListener("touchend", handleKeyUp);
    };
  }, [
    jumping,
    gameover,
    obstaclePassed,
    socket,
    canJump,
    distance,
    passingScore,
    hasSentSuccess,
    data,
  ]);

  const handleResultPageNavigation = () => {
    if (distance >= passingScore) {
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
        <span className="heart2"> {distance.toFixed(2)} m</span>
        <div className={`dino ${jumping ? "jump" : ""}`} ref={dinoRef} />
        <div className={`obstacle ${obstacleType}`} ref={obstacleRef} />
      </div>
      <div className="info2">{/* <div>속도: {speed.toFixed(2)}</div> */}</div>

      {gameover && (
        <div className="score">
          <div id="distance">Total Distance: {distance.toFixed(2)} m</div>
          <button
            className="restart"
            id="restart"
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
