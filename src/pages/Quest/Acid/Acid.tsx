import React, { useState, useEffect, useRef } from "react";
import "./Acid.css";

const wordString = `어쩜 이렇게 하늘은 더 파란 건지?
오늘따라 왜 바람은 또 완벽한지?
그냥 모르는 척, 하나 못들은 척
지워버린 척 딴 얘길 시작할까
아무 말 못하게 입맞출까
눈물이 차올라서 고갤 들어
흐르지 못하게 또 살짝 웃어
내게 왜 이러는지? 무슨 말을 하는지?
오늘 했던 모든 말 저 하늘 위로
한번도 못했던 말
울면서 할 줄은 나 몰랐던 말
나는요 오빠가 좋은걸
어떡해?
새로 바뀐 내 머리가 별로였는지
입고 나왔던 옷이 실수였던 건지
아직 모르는 척, 기억 안 나는 척
아무 일없던 것처럼 굴어볼까
그냥 나가자고 얘기할까?
눈물이 차올라서 고갤 들어
흐르지 못하게 또 살짝 웃어
내게 왜 이러는지? 무슨 말을 하는지?
오늘 했던 모든 말 저 하늘 위로
한번도 못했던 말
울면서 할 줄은 나 몰랐던 말
나는요 오빠가 좋은걸 (휴)
어떡해?
이런 나를 보고 그런 슬픈 말은 하지 말아요 (하지 말아요)
철없는 건지, 조금 둔한 건지, 믿을 수가 없는걸요
눈물은 나오는데 활짝 웃어
네 앞을 막고서 막 크게 웃어
내가 왜 이러는지? 부끄럼도 없는지?
자존심은 곱게 접어 하늘위로
한 번도 못했던 말
어쩌면 다신 못할 바로 그 말
나는요 오빠가 좋은걸 (아이쿠, 하나, 둘)
I'm in my dream
It's too beautiful, beautiful day
Make it a good day
Just don't make me cry
이렇게 좋은 날`.split(/ |\n/gm);

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
  const speed = 1.5;
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
            <label className="col-form-label">점수 : </label>
            <label className="col-form-label" id="score">
              {score}
            </label>
          </div>
          <div>
            <label className="col-form-label">실패 : </label>
            <label className="col-form-label" id="failed">
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
              게임 설명
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
              className="btn-hover color-a"
              role="button"
              id="start"
              onClick={startGame}
            >
              게임 시작
            </button>
          </div>
        )}
        {gameover && !showHelp && (
          <div>
            <div id="end-score">점수 : {score}</div>
            <button
              className="btn-hover color-a"
              id="restart"
              onClick={startGame}
            >
              다시 시작
            </button>
            <button className="btn-hover color-a" onClick={showHelpScreen}>
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
