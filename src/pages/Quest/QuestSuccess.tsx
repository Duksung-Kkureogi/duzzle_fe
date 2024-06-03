import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./QuestSuccess.css";

function QuestSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    const confettiInterval = setInterval(() => {
      confetti({
        particleCount: 150,
        spread: 60,
      });
    }, 3000);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <div className="Questsuccess">
      <div className="text_suc">QUEST 성공</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#FFC10A"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#FFC10A"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
      </svg>
      <div className="text_dal">1DAL</div>
      <div className="text_done">지급 완료</div>
      <div className="buttons">
        <button
          className="btn btn-primary btn-jittery"
          onClick={() => nav("/store")}
        >
          상점에서 재료 NFT 구입
        </button>
      </div>
    </div>
  );
}

export default QuestSuccess;
