import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Quest.css";

function Quest() {
    const nav = useNavigate();
    const [randomQuiz, setRandomQuiz] = useState(null);
    const [quizType, setQuizType] = useState(""); // 퀴즈 종류 상태 추가

    useEffect(() => {
        // 랜덤 퀴즈 선택 API 호출
        // API 호출 후 randomQuiz 상태 업데이트
        const getRandomQuiz = async () => {
            try {
                const response = await fetch("API_URL");
                const data = await response.json();
                setRandomQuiz(data);
                setQuizType(data.type); // 퀴즈 종류 업데이트
            } catch (error) {
                console.error("Error fetching random quiz:", error);
                // API 연결이 안될 시에는 speedQuiz로 설정
                setQuizType("speedQuiz");
            }
        };
        
        getRandomQuiz();
    }, []);

    const startQuiz = () => {
        // 랜덤 퀴즈 종류에 따라 해당 퀴즈로 이동
        if (quizType === "speedQuiz") {
            nav("/questspeed");
        } else if (quizType === "rainQuiz") {
            nav("/questrain");
        } // 이후 다른 종류의 퀴즈가 추가된다면 계속해서 else if 문으로 처리
    };

    return (
        <div className="Quest">
            <div className="random"> RANDOM QUEST</div>
            <div id="wrap">
                <div className="dice">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                </div>
            </div>
            <button className="btn-hover color-6" onClick={startQuiz}>START</button>
            {randomQuiz}
        </div>
    );
}

export default Quest;
