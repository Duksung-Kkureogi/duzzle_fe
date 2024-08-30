import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Jump.css";
import "./Character.css";
import CharacterImg from "./character.png";

const Character = () => {
  const [top, setTop] = useState(375);
  const [isJumping, setIsJumping] = useState(false);

  const handleKeyDown = (e) => {
    if (e.keyCode === 32 && !isJumping) {
      setIsJumping(true);
      jump();
    }
  };

  const jump = () => {
    const updateTime = 20;
    const jumpHeight = 120;
    const speed = 10;
    let i = 0;

    const jumpInterval = setInterval(() => {
      if (i < jumpHeight / speed) {
        setTop(375 - speed * i);
      } else {
        setTop(375 - speed * ((2 * jumpHeight) / speed - i));
      }

      if (i >= (2 * jumpHeight) / speed) {
        clearInterval(jumpInterval);
        setIsJumping(false);
      }

      i++;
    }, updateTime);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isJumping]);

  return (
    <img
      src={CharacterImg}
      className="character"
      style={{ top: top }}
      alt="character"
    />
  );
};

export default Character;
