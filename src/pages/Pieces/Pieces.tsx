import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";
import { piece_data } from "./piece_data";

function Pieces() {
  const [totalPieces, setTotalPieces] = useState(0);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    setPieces(piece_data);
    setTotalPieces(piece_data.length);
  }, [piece_data]);

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
      <div className="pieces_filter"></div>
      <div className="pieces_main">
        <div className="piece">
          <ul>
            {pieces.map((piece, index) => (
              <li key={index}>
                {piece.PuzzlePieceDto.seasonName} -{" "}
                {piece.PuzzlePieceDto.zoneName} (Piece ID:{" "}
                {piece.PuzzlePieceDto.pieceId})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Pieces;
