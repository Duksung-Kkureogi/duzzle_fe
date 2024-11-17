import { useState, useEffect, useRef } from "react";
import { useVolume } from "./VolumeContext";

export const useAudio = (url: string | null) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useVolume();

  useEffect(() => {
    if (!url) {
      setError("오디오 URL이 제공되지 않았습니다.");
      return;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audioRef.current.volume = volume;

    const handleCanPlayThrough = () => setAudioLoaded(true);
    const handleError = (e: ErrorEvent) => {
      setError(
        `오디오 로딩 실패: ${
          (e.target as HTMLAudioElement).error?.message || "알 수 없는 오류"
        }`
      );
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("error", handleError);
    };
  }, [url, volume]);

  return { audioRef, audioLoaded, error };
};
