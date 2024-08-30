import React, { useState, useEffect, useRef } from "react";
import "./Background.css";
import BackgroundImg from "./Background.jpg";

function Background() {
  const [offSet, setOffSet] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateTime = 20;
    const speed = 5;

    const canvas = document.querySelector(
      "canvas#background"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const imageObj = new Image();
    imageObj.src = BackgroundImg;

    const draw = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(
        imageObj,
        offSet,
        0,
        imageObj.width - offSet,
        imageObj.height,
        0,
        0,
        canvasWidth - (offSet * canvasWidth) / imageObj.width,
        canvasHeight
      );

      ctx.drawImage(
        imageObj,
        0,
        0,
        offSet,
        imageObj.height,
        canvasWidth - (offSet * canvasWidth) / imageObj.width,
        0,
        (offSet * canvasWidth) / imageObj.width,
        canvasHeight
      );
    };

    const updateBackground = () => {
      setOffSet((prevOffSet) => (prevOffSet + speed) % imageObj.width);
    };

    intervalRef.current = window.setInterval(() => {
      updateBackground();
      draw();
    }, updateTime);

    return () => clearInterval(intervalRef.current);
  }, [offSet]);

  return (
    <canvas
      width="600px"
      height="500px"
      id="background"
      className="background"
    ></canvas>
  );
}

export default Background;
