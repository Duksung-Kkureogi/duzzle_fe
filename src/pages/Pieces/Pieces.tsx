import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";
import { piece_data } from "./piece_data";
import { PuzzlePieceDto } from "./PuzzlePieceDTO";

function Pieces() {
  const [totalPieces, setTotalPieces] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [season, setSeason] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    setPieces(piece_data);
    setTotalPieces(piece_data.length);
  }, []);

  useEffect(() => {
    filterPieces();
  }, [season, zone, pieces]);

  const filterPieces = () => {
    let filtered = pieces;
    if (season) {
      filtered = filtered.filter((piece) => piece.seasonName === season);
    }
    if (zone) {
      filtered = filtered.filter((piece) => piece.zoneName === zone);
    }
    setFilteredPieces(filtered);
  };

  const getUniqueValues = (key: keyof PuzzlePieceDto): string[] => {
    return [...new Set(piece_data.map((piece) => String(piece[key])))];
  };

  const seasons = getUniqueValues("seasonName");
  const zones = getUniqueValues("zoneName");

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
      <div className="pieces_filter">
        <div className="filter_season">
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="">시즌 전체</option>
            {seasons.map((season, index) => (
              <option key={index} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
        <div className="filter_zone">
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">구역 전체</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="pieces_main">
        <div className="piece">
          <ul>
            {filteredPieces.map((piece, index) => (
              <li key={index}>
                {piece.seasonName} - {piece.zoneName} (Piece ID: {piece.pieceId}
                )
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Pieces;
