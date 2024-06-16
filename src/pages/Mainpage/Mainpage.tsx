import React, { useCallback, useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import "./Mainpage.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import Modal from "react-modal";
import { PieceDto, Minted, Unminted } from "./PieceDto";
import { pieces } from "./PieceData";
import axios from "axios";
import { seasonList } from "../../util/season";

function Mainpage() {
  const [scale, setScale] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<PieceDto | null>(null);

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
        console.log(response);
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
      width: "350px",
      height: "550px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#80DAE6",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
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
                      left: `${piece.points.x}px`,
                      top: `${piece.points.y}px`,
                      transform: `scale(${1 / scale})`,
                    }}
                  >
                    {piece.zoneName}
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
                          <p className="info owner">
                            {(selectedPiece.data as Minted).owner.name}
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
                          <p className="info">{selectedPiece.zoneName}</p>
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
                          <button>NFT 발행하기</button>
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
