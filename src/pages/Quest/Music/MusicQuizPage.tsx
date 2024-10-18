import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestApis } from "../../../services/api/quest.api";
import { useAudio } from "../../../services/useAudio";
import { LyricsInput } from "../../../components/LyricsInput";

const MusicQuizPage: React.FC = () => {
  const isAuthenticated = localStorage.getItem("accessToken");
  const nav = useNavigate();
  const { logId } = useParams<{ logId: string }>();
  const lyrics = localStorage.getItem("lyrics") || "";
  const audioUrl = localStorage.getItem("audioUrl");
  const timeLimit = parseInt(localStorage.getItem("timeLimit") || "30", 10);

  const [answers, setAnswers] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const { audioRef, audioLoaded, error } = useAudio(audioUrl);

  useEffect(() => {
    const blankCount = (lyrics.match(/\?\?/g) || []).length;
    setAnswers(new Array(blankCount).fill(""));
  }, [lyrics]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Audio play error:", e));
    }
  }, [audioRef]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsStarted(false);
  }, [audioRef]);

  const handleQuit = useCallback(() => {
    stopAudio();
    nav("/questfail");
  }, [nav, stopAudio]);

  const handleSubmit = useCallback(async () => {
    stopAudio();
    if (!logId) {
      console.error("LogId is undefined");
      return;
    }

    try {
      const result = isAuthenticated
        ? await QuestApis.getResult(
            { logId: Number(logId), answer: answers },
            {
              Authorization: isAuthenticated,
            }
          )
        : await QuestApis.getResultForGuest({
            logId: Number(logId),
            answer: answers,
          });

      nav(result ? "/questsuccess" : "/questfail");
    } catch (error) {
      console.error("Error submitting answers:", error);
      // 에러 처리 로직 (예: 사용자에게 알림)
    }
  }, [isAuthenticated, logId, answers, nav, stopAudio]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isStarted) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>가사 빈칸 채우기 퀴즈</h2>
        <p>시작 버튼을 누르면 음악이 재생되고 퀴즈가 시작됩니다.</p>
        <button
          onClick={handleStart}
          disabled={!audioLoaded}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: audioLoaded ? "pointer" : "not-allowed",
          }}
        >
          {audioLoaded ? "시작하기" : "오디오 로딩 중..."}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>가사 빈칸 채우기 퀴즈</h2>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        남은 시간: {formatTime(timeLeft)}
      </p>
      <LyricsInput lyrics={lyrics} answers={answers} setAnswers={setAnswers} />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          className="submit btn"
          onClick={handleSubmit}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          제출하기
        </button>
        <button
          className="quit btn"
          onClick={handleQuit}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          그만하기
        </button>
      </div>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default MusicQuizPage;
