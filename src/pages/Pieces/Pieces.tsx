import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";
import axios from "axios";
import { zoneList } from "../../util/zone";

function Pieces() {
  const [totalPieces, setTotalPieces] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);

  interface Piece {
    id: number;
    name: string;
    image: string;
    zoneKr: string;
  }

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    const getUserPuzzle = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(RequestUrl + "/v1/my/nft-puzzles", {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: { count: 4, page: 0 },
        });
        console.log(response);
        if (response.data.result) {
          setTotalPieces(response.data.data.total);
          setPieces(response.data.data.list);
        } else {
          console.error("Failed to fetch pieces");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserPuzzle();
  }, [RequestUrl]);

  const [isSActive, setIsSActive] = useState(false);
  const [isZActive, setIsZActive] = useState(false);
  const [filterSeason, setFilterSeason] = useState("시즌");
  const [filterZone, setFilterZone] = useState("구역");

  const handleOptionClick = (option: string, filter: string) => {
    if (filter === "season") {
      setFilterSeason(option);
      setIsSActive(false);
    } else {
      setFilterZone(option);
      setIsZActive(false);
    }
  };

  const handleLabelClick =
    (filter: string): React.MouseEventHandler<HTMLButtonElement> =>
    () => {
      if (filter === "season") {
        setIsSActive((prevState) => !prevState);
      } else {
        setIsZActive((prevState) => !prevState);
      }
    };

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
        <div className={`filter season ${isSActive ? "active" : ""}`}>
          <button className="label" onClick={handleLabelClick("season")}>
            {filterSeason}
            {isSActive ? (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                ></path>
              </svg>
            ) : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                ></path>
              </svg>
            )}
          </button>
          <ul className="optionList">
            <li
              className="optionItem"
              onClick={() => handleOptionClick("시즌 전체", "season")}
            >
              시즌 전체
            </li>
            <li
              className="optionItem"
              onClick={() => handleOptionClick("크리스마스", "season")}
            >
              크리스마스
            </li>
            <li
              className="optionItem"
              onClick={() => handleOptionClick("여름", "season")}
            >
              여름
            </li>
            <li
              className="optionItem"
              onClick={() => handleOptionClick("가을", "season")}
            >
              가을
            </li>
          </ul>
        </div>
        <div className={`filter zone ${isZActive ? "active" : ""}`}>
          <button className="label" onClick={handleLabelClick("zone")}>
            {filterZone}
            {isZActive ? (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                ></path>
              </svg>
            ) : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                ></path>
              </svg>
            )}
          </button>
          <ul className="optionList">
            <li
              className="optionItem"
              onClick={() => handleOptionClick("구역 전체", "zone")}
            >
              구역 전체
            </li>
            {zoneList.map((zone) => (
              <li
                className="optionItem"
                onClick={() => handleOptionClick(zone.nameKr, "zone")}
              >
                {zone.nameKr}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pieces_main">
        {pieces.map((piece) => (
          <div className="piece" key={piece.name}>
            <img src={piece.image} alt={piece.name} />
            <p>{piece.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pieces;
