import React, { useState } from "react";
import Character from "./Character";
import Background from "./Background";
import Enemy from "./Enemy";

const Jump = () => {
  const [isMove, setIsMove] = useState(false);

  const startMoving = () => {
    setIsMove(true);
  };
  return (
    <div className="jump">
      <Background />
      <Character />
      <Enemy isMove={isMove} />
    </div>
  );
};

export default Jump;
