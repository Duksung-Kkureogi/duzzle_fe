import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useVolume } from "../../services/VolumeContext";

interface AudioPlayerProps {
  source: string;
  loop: boolean;
}

export interface AudioPlayerHandle {
  play: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ source, loop }, ref) => {
    const { volume } = useVolume();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      },
    }));

    return (
      <audio ref={audioRef} style={{ display: "none" }} loop={loop}>
        <source src={source} type="audio/mpeg" />
      </audio>
    );
  }
);

export default AudioPlayer;
