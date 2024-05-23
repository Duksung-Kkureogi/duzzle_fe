import React, { useEffect, useRef } from "react";

const CanvasAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const drops = [];

    canvas.width = window.innerWidth; // 캔버스 너비를 창 너비로 설정
    canvas.height = window.innerHeight; // 캔버스 높이를 창 높이로 설정

    class Drop {
      x: number;
      y: number;
      speed: number;
      length: number;

      constructor(x: number, y: number, speed: number, length: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.length = length;
        this.draw();
      }

      draw() {
        context.beginPath();
        context.strokeStyle = "#0077cc";
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y + this.length);
        context.stroke();
        context.closePath();
      }
    }

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.x = Math.random() * canvas.width;
          drop.speed = Math.random() * 3 + 1;
          drop.length = Math.random() * 5 + 2;
        }

        drop.draw();
      });

      requestAnimationFrame(render);
    }

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speed = Math.random() * 3 + 1;
      const length = Math.random() * 5 + 2;
      drops.push(new Drop(x, y, speed, length));
    }
    render();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default CanvasAnimation;
