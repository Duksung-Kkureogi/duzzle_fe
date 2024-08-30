import React, { useState, useEffect } from "react";
import "./Enemy.css";
import EnemyImg from "./Enemy.png";

const Enemy = ({ isMove }) => {
  const [left, setLeft] = useState(980);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    console.log("isMove prop:", isMove);
    console.log("isMoving state:", isMoving);
    if (isMove && !isMoving) {
      setIsMoving(true);
      setLeft(980);
      move();
    }
  }, [isMove]);

  const move = () => {
    const updateTime = 20;
    const speed = 10;
    let i = 0;

    const moveInterval = setInterval(() => {
      setLeft((prevLeft) => {
        const newLeft = prevLeft - speed;
        if (newLeft <= -80) {
          // 적이 화면 밖으로 나가면 이동을 멈춤
          clearInterval(moveInterval);
          setIsMoving(false);
          return 980;
        }
        return newLeft;
      });

      i++;
    }, updateTime);
  };

  return isMoving ? (
    <img src={EnemyImg} className="enemy" style={{ left: left }} alt="enemy" />
  ) : null;
};

export default Enemy;
