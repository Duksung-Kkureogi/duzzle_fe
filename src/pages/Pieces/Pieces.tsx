import { useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";

function Pieces() {
  const [totalPieces, setTotalPieces] = useState(20);

  return (
    <div className="Pieces">
      <MyHeader headerText="퍼즐조각 NFT" leftChild={<MyButton />} />
      <div className="pieces_title">
        <p>나의 조각</p>
      </div>
      <div className="pieces_total">
        <img src="/src/assets/images/piece.png" />
        <p>{totalPieces} Pieces</p>
      </div>
    </div>
  );
}

export default Pieces;
