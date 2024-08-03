import React, { useCallback, useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import "./Mainpage.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import Modal from "react-modal";
import { PieceDto, Minted, Unminted } from "../../Data/DTOs/PieceDTO";
import axios from "axios";
import { seasonList } from "../../util/season";
import { useAuth } from "../../services/AuthContext";
import RPC from "../../../ethersRPC";
import { IProvider } from "@web3auth/base";
import { useNavigate } from "react-router-dom";

function Mainpage() {
  const navigate = useNavigate();
  const { web3auth } = useAuth();
  const [scale, setScale] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pieces, setPieces] = useState<PieceDto[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PieceDto | null>(null);
  const [totalPieces, setTotalPieces] = useState(0);
  const [mintedPieces, setMintedPieces] = useState(0);

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;
  const seasonId = seasonList[seasonList.length - 1].id;

  useEffect(() => {
    const getPuzzle = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          RequestUrl + `/v1/puzzle/${seasonId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.result) {
          const pieceData = response.data.data.pieces;
          setPieces(pieceData);
          setTotalPieces(response.data.data.total);
          setMintedPieces(response.data.data.minted);
        } else {
          console.error("Failed to fetch pieces");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPuzzle();
  }, [RequestUrl, seasonId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleScaleChange(event: any) {
    setScale(event.instance.transformState.scale);
  }

  const openModal = useCallback((piece: PieceDto) => {
    setSelectedPiece(piece);
    setModalOpen(true);
  }, []);

  function closeModal() {
    setModalOpen(false);
    setSelectedPiece(null);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "65vw",
      maxWidth: "300px",
      height: "60vh",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#80DAE6",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
      overflow: "hidden",
    },
  };

  const unlockPuzzlePiece = async (pieceId: number) => {
    const rpc = new RPC(web3auth?.provider as IProvider);
    try {
      const pieceMetadataUrl = await rpc.unlockPuzzlePiece(pieceId);
      console.log(pieceMetadataUrl);
      setModalOpen(false);
      alert("조각NFT 발행을 성공하였습니다.");
    } catch (error) {
      console.log(error);
      setModalOpen(false);
      if (confirm("재료가 부족합니다")) {
        navigate("store");
      }
    }
  };

  return (
    <div className="Mainpage">
      <div className="mainImg">
        <TransformWrapper
          initialScale={1}
          initialPositionX={-170}
          initialPositionY={0}
          centerOnInit
          onTransformed={(e) => handleScaleChange(e)}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              {/* <div>
                <p>
                  발행된 NFT: <b>{mintedPieces}</b> / {totalPieces} <br />
                  남은 NFT: <b>{totalPieces - mintedPieces}</b>
                </p>
              </div> */}
              <div className="tools">
                <button onClick={() => zoomIn()}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    ></path>
                  </svg>
                </button>
                <button onClick={() => zoomOut()}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    ></path>
                  </svg>
                </button>
                <button onClick={() => resetTransform()}>RESET</button>
              </div>
              <TransformComponent>
                <img src="/src/assets/images/mainImg.png" />
                {pieces.map((piece) => (
                  <div
                    className="piece"
                    onClick={() => openModal(piece)}
                    key={piece.pieceId}
                    style={{
                      left: `${piece.coordinates.split(",")[0]}%`,
                      top: `${piece.coordinates.split(",")[1]}%`,
                      transform: `scale(${1 / scale})`,
                      backgroundColor: piece.minted ? "#f47735" : "#8C8C8C",
                    }}
                  >
                    {piece.zoneNameKr}
                  </div>
                ))}
                {selectedPiece && (
                  <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    shouldCloseOnOverlayClick={false}
                  >
                    {selectedPiece.minted ? (
                      <div className="modal_mintedO">
                        <div className="mintedO_piece">
                          <p className="info_title">NFT 컬렉션</p>
                          <p className="info">덕성 크리스마스 퍼즐 100조각</p>
                          <p className="info_title">조각 아이디</p>
                          <p className="info">{selectedPiece.pieceId}</p>
                          <p className="info_title">토큰 소유자</p>
                          <p
                            id="owner"
                            className="info owner"
                            onClick={() => navigate("otherprofile")}
                          >
                            {(selectedPiece.data as Minted).owner.name}
                            <span className="tooltip_text">
                              사용자 프로필 보기
                            </span>
                          </p>
                          <p className="info wallet">
                            (
                            {(selectedPiece.data as Minted).owner.walletAddress}
                            )
                          </p>
                          <div className="piece_img">
                            <img
                              src={
                                (selectedPiece.data as Minted).nftThumbnailUrl
                              }
                            ></img>
                          </div>
                        </div>
                        <div className="mintedO_btn">
                          <button onClick={closeModal}>닫기</button>
                          <button>NFT 상세</button>
                        </div>
                      </div>
                    ) : (
                      <div className="modal_mintedX">
                        <div className="mintedX_piece">
                          <p className="info_title">NFT 컬렉션</p>
                          <p className="info">덕성 크리스마스 퍼즐 100조각</p>
                          <p className="info_title">조각 위치</p>
                          <p className="info">{selectedPiece.zoneNameKr}</p>
                          <p className="info_title">재료</p>
                          {(selectedPiece.data as Unminted).requiredItems.map(
                            (item, index) => (
                              <div className="required_items" key={index}>
                                <img src={item.image} />
                                <p className="info items">
                                  {item.name} X {item.count}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                        <div className="mintedX_btn">
                          <button onClick={closeModal}>닫기</button>
                          <button
                            onClick={() => {
                              unlockPuzzlePiece(selectedPiece.pieceId);
                            }}
                          >
                            NFT 발행하기
                          </button>
                        </div>
                      </div>
                    )}
                  </Modal>
                )}
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
      <MyBottomNavBar />
    </div>
  );
}

export default Mainpage;
