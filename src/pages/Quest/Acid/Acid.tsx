import React, { useState, useEffect, useRef } from "react";
import "./Acid.css";
import {
  AcidRainEventName as Event,
  AcidRainProps,
  WordInstance,
  CORRECT_ANSWER_POINTS,
  WRONG_ANSWER_PENALTY,
  MISSING_ANSWER_PENALTY,
} from "./Acid.types";
import { useWebSocket } from "../../../services/WebSocketContext";
import { useNavigate } from "react-router-dom";
import {
  ToastComponent,
  ToastProps,
  ToastType,
} from "../../../components/Toast";

const Word = ({ word, x, y }) => {
  return (
    <div className="word" style={{ left: x, top: y }}>
      {word}
    </div>
  );
};

const Acid: React.FC<AcidRainProps> = ({ logId, data }) => {
  const nav = useNavigate();
  const { dropIntervalMs, dropDistance, gameoverLimit, passingScore } = data;

  // 글자 복사 방지
  document.onselectstart = function () {
    return false;
  };

  const [waitWords, setWaitWords] = useState<string[]>([]);
  const [activeWordObjs, setActiveWordObjs] = useState<WordInstance[]>([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const inputRef = useRef<any>();
  const gamePanelRef = useRef<any>();
  const { socket } = useWebSocket();
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleHit = (hitWord: string) => {
    // 맞춘단어는 active word 에서 제거
    const index = activeWordObjs.findIndex(
      (element) => element.word === hitWord
    );
    if (index !== -1) {
      clearInterval(activeWordObjs[index].interval);
      setActiveWordObjs((prev) => prev.filter((_, i) => i !== index));
    }

    showToast(`+ ${CORRECT_ANSWER_POINTS}점`, ToastType.Success);
  };

  const handleWrong = () => {
    showToast(`- ${WRONG_ANSWER_PENALTY}점`, ToastType.Error);
  };

  useEffect(() => {
    const handleNewWord = (newWord: string) => {
      console.timeLog("game", `new word: ${newWord}`);
      setWaitWords((prev) => {
        return [...prev, newWord];
      });
    };

    const handleScore = (score: number) => {
      setScore(score);
    };

    const handleGameover = (score: number) => {
      console.timeLog("game", "gameover!!! ");
      setGameover(true);
      setScore(score);
      setActiveWordObjs([]);
      setIsSucceeded(false);
    };

    const handleMissedWord = (data: { word: string; count: number }) => {
      const { word, count } = data;
      setFailed(count);
      showToast(`- ${MISSING_ANSWER_PENALTY}점`, ToastType.Warning);

      console.log(
        `0.5 점 마이너스!! ${word} 놓쳤다고 판단, 지금까지 놓친 단어 수 = ${count}`
      );
    };

    const handleResult = (data: { result: boolean; score: number }) => {
      const { result, score } = data;
      setScore(score);
      console.timeLog("game", `최종 결과: result:${result}, score: ${score}`);
      setGameover(true);
      setActiveWordObjs([]);
      setIsSucceeded(result);
    };

    socket.on(Event.Inbound.Word, handleNewWord);
    socket.on(Event.Inbound.Score, handleScore);
    socket.on(Event.Inbound.Hit, handleHit);
    socket.on(Event.Inbound.Wrong, handleWrong);
    socket.on(Event.Inbound.GameOver, handleGameover);
    socket.on(Event.Inbound.Miss, handleMissedWord);
    socket.on(Event.Inbound.Result, handleResult);

    // 컴포넌트 언마운트 시 소켓 이벤트 리스너 정리
    return () => {
      socket.off(Event.Inbound.Word, handleNewWord);
      socket.off(Event.Inbound.Score, handleScore);
      socket.off(Event.Inbound.Hit, handleHit);
      socket.off(Event.Inbound.Wrong, handleWrong);
      socket.off(Event.Inbound.GameOver, handleGameover);
      socket.off(Event.Inbound.Miss, handleMissedWord);
      socket.off(Event.Inbound.Result, handleResult);
    };
  }, []);

  useEffect(() => {
    if (!gameover && !showHelp && socket) {
      inputRef.current?.focus();
      document.addEventListener("click", handleClick);
      dropWord();
      const repaintInterval = setInterval(() => {
        repaint();
      }, dropIntervalMs);

      return () => {
        clearInterval(repaintInterval);
      };
    }
  }, [gameover, showHelp, waitWords]);

  const dropWord = () => {
    if (waitWords.length !== 0) {
      const word = waitWords.shift()!;
      const wordInstance = {
        word,
        x: Math.random() * gamePanelRef.current.offsetWidth,
        y: 0,
        interval: setInterval(() => {
          wordInstance.y += dropDistance;
        }, dropIntervalMs),
      };
      setActiveWordObjs((prev) => [...prev, wordInstance]);
    }
  };

  const repaint = () => {
    setActiveWordObjs(
      (prev) =>
        prev
          .map((wordObj) => {
            if (wordObj.y >= gamePanelRef.current.offsetHeight - 10) {
              clearInterval(wordObj.interval);

              return null;
            }
            return wordObj;
          })
          .filter(Boolean) as WordInstance[]
    );
  };

  const hitWord = (word: string) => {
    if (socket) {
      socket.emit(Event.Outbound.Answer, { answer: word });
      console.log(`서버 유저 입력 단어 전송: ${word}`);
      socket.on("hit", handleHit);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }
    inputRef.current.focus();
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      hitWord(inputRef.current.value.trim());

      inputRef.current.value = "";
    }
  };

  const startGame = () => {
    setActiveWordObjs([]);
    setScore(0);
    setFailed(0);
    setGameover(false);
    setShowHelp(false);
    inputRef.current.focus();

    if (socket) {
      socket.connect();
      console.time("game");
      socket.emit(Event.Outbound.Start, {
        logId,
        gamePanelOffsetHeight: gamePanelRef.current.offsetHeight,
      });

      socket.on("exception", (data) => {
        console.error("Error from server:", data);
      });
    }
  };

  const showHelpScreen = () => {
    setShowHelp(true);
  };

  const handleClick = () => {
    if (!gameover && !showHelp) {
      inputRef.current?.focus();
    }
  };

  const handleResultPageNavigation = () => {
    if (isSucceeded) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  };

  return (
    <div className="container-fluid">
      <div ref={gamePanelRef} id="game-panel" className="container"></div>
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        id="control-panel-frame"
      >
        <div
          id="control-panel"
          className="col-md-5 align-content-center container"
        >
          <div>
            <label className="my-score">점수 : </label>
            <label className="my-score" id="score-1">
              {score}
            </label>
          </div>
          <div>
            <label className="my-score">실패 : </label>
            <label className="my-score" id="failed">
              {failed}
            </label>
          </div>
          <input type="text" ref={inputRef} onKeyDown={handleKeyDown} />
        </div>
      </div>
      <div id="board" className="d-flex align-items-center flex-column">
        {showHelp && (
          <div id="help-div">
            <label className="col-form-label" id="help-title">
              산성비 게임💧
            </label>
            <div>
              1. 위에서 떨어지는 단어가 <b>바닥에 닿기 전에</b> 해당 단어를{" "}
              <b>입력</b>하여 점수를 획득하세요.
              <br />
              2. 없는 단어 입력 시 <b>점수가 차감</b>됩니다. <br />
              3. <b>{gameoverLimit}개</b>가 바닥에 떨어지면 <b>게임은 종료</b>
              됩니다.
              <br />
              4. 단어가 모두 나와서 처리되면 <b>게임은 종료</b>됩니다. <br />
              5. 게임이 종료되면 획득한 점수가 공개됩니다. <br />
              6. <b>{passingScore}점</b> 이상 획득시 성공, <b>1 DAL 🌛</b> 지급
              <br />
            </div>
            <button
              className="buttonstart"
              role="button"
              id="start"
              onClick={startGame}
            >
              게임 시작
            </button>
          </div>
        )}
        {gameover && !showHelp && (
          <div className="score">
            <div id="end-score">점수 : {score}</div>
            <button
              className="restart"
              id="restart"
              onClick={handleResultPageNavigation}
            >
              결과 확인
            </button>
            <button className="explain" onClick={showHelpScreen}>
              게임 설명
            </button>
          </div>
        )}
      </div>
      {activeWordObjs.map((wordObj, index) => (
        <Word key={index} word={wordObj.word} x={wordObj.x} y={wordObj.y} />
      ))}
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Acid;
