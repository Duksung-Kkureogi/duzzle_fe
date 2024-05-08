import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QuestSpped.css";

function QuestSpeed() {
    const nav = useNavigate();
    const [timeLeft, setTimeLeft] = useState(30);
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
            nav("/questfail");
        }
    }, [isTimerRunning, timeLeft, nav]);

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        const correctAnswers = ["3", "가정약학관", "김수근", "건축상"];
        if (JSON.stringify(answers) === JSON.stringify(correctAnswers)) {
            nav("/questsuccess");
        } else {
            nav("/questfail");
        }
    };

    return (
        <>
            <div className="QuestSpeed">
                [스피드 퀴즈]
            </div>
            <div className="time-info">
                <div>제한시간: 30초</div>
                <div>남은시간: {timeLeft}초</div>
            </div>
            <div className="quiz-container">
                <div className="quiz">
                    덕성여자대학교 쌍문동 캠퍼스에서 첫번째로 지어진 건물 중 하나인 자연관은 1. <input type="text" maxLength="2" value={answers[0]} onChange={(e) => handleInputChange(0, e.target.value)} />층 건물이다.
                    자연관의 구 명칭은 <input type="text" maxLength="6" value={answers[1]} onChange={(e) => handleInputChange(1, e.target.value)} />이였다.
                    <br />
                    자연관은 대한민국 현대 건축 1세대 <input type="text" maxLength="4" value={answers[2]} onChange={(e) => handleInputChange(2, e.target.value)} /> 건축가의 작품이다.
                    또한, 1979에 <input type="text" maxLength="7" value={answers[3]} onChange={(e) => handleInputChange(3, e.target.value)} />상을 수상하였다.
                </div>
            </div>
            <div className="buttons">
                <button className="submit-btn" onClick={handleSubmit}>제출하기</button>
                <button className="quit-btn" onClick={() => nav("/questfail")}>그만하기</button>
            </div>
        </>
    );
}

export default QuestSpeed;
