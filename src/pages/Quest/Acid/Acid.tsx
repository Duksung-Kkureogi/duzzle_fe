import React, { useState, useEffect, useRef } from "react";
import "./Acid.css";

const wordString = `아른아른 아지랑이 괜히 눈이 부시고
포근해진 얼음은 겨우 녹아내릴 것만 같아
동지섣달 기나긴 밤 지나 헤매었던 발걸음
있잖아 까맣고 혼자 외로운 날 그 때가 기억조차 안 나
새하얗게 웃던 날을 기억하나요 그대
내가 느낀 모든 걸 너에게 줄 수 있다면
바람아 내게 봄을 데려와 줘 벚꽃잎이 흩날리듯이
`.split(/ |\n/gm);

const Word = ({ word, x, y }) => {
  return (
    <div className="word" style={{ left: x, top: y }}>
      {word}
    </div>
  );
};

const Acid = () => {
  const [waitWords, setWaitWords] = useState([...wordString]);
  const [activeWordObjs, setActiveWordObjs] = useState([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const inputRef = useRef(null);
  const gamePanelRef = useRef(null);
  const speed = 2;
  const delay = 1000;
  const gameoverLimit = 5;

  useEffect(() => {
    if (!gameover && !showHelp) {
      inputRef.current.focus();
      document.addEventListener("click", handleClick);
      const dropInterval = setInterval(() => {
        dropWord();
        if (isGameOver() || isGameClear()) {
          clearInterval(dropInterval);
          setActiveWordObjs([]);
          setGameover(true);
        }
      }, delay);

      const repaintInterval = setInterval(() => {
        repaint();
      }, 30);

      return () => {
        clearInterval(dropInterval);
        clearInterval(repaintInterval);
      };
    }
  }, [gameover, showHelp, waitWords]);

  const dropWord = () => {
    if (waitWords.length !== 0) {
      const word = waitWords.shift();
      const wordInstance = {
        word,
        x: Math.random() * gamePanelRef.current.offsetWidth,
        y: 0,
        interval: null,
      };
      wordInstance.interval = setInterval(() => {
        wordInstance.y += speed;
      }, 30);
      setActiveWordObjs((prev) => [...prev, wordInstance]);
    }
  };

  const repaint = () => {
    setActiveWordObjs((prev) =>
      prev
        .map((wordObj) => {
          if (wordObj.y >= gamePanelRef.current.offsetHeight - 10) {
            setFailed((prev) => prev + 0.5);
            clearInterval(wordObj.interval);
            return null;
          }
          return wordObj;
        })
        .filter(Boolean)
    );
  };

  const hitWord = (word) => {
    console.log("입력된 단어:", word);
    const index = activeWordObjs.findIndex((element) => element.word === word);
    if (index !== -1) {
      clearInterval(activeWordObjs[index].interval);
      setActiveWordObjs((prev) => prev.filter((_, i) => i !== index));
      setScore((prev) => prev + 1);
    } else {
      setScore((prev) => (prev > 0 ? prev - 1 : 0));
    }
    console.log("score", score);
  };

  const isGameOver = () => failed >= gameoverLimit;
  const isGameClear = () =>
    activeWordObjs.length === 0 && waitWords.length === 0;

  const handleKeyDown = (event) => {
    inputRef.current.focus();
    if (event.key === "Enter" || event.key === " ") {
      hitWord(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  const startGame = () => {
    setWaitWords([...wordString]);
    setActiveWordObjs([]);
    setScore(0);
    setFailed(0);
    setGameover(false);
    setShowHelp(false);
    inputRef.current.focus();
  };

  const showHelpScreen = () => {
    setShowHelp(true);
  };

  const handleClick = () => {
    if (!gameover && !showHelp) {
      inputRef.current.focus();
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
              5. 게임이 종료되면 획득한 점수가 공개됩니다.
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
            <button className="restart" id="restart" onClick={startGame}>
              다시 시작
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
    </div>
  );
};

export default Acid;
