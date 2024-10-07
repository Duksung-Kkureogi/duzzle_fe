import "./DrTwo.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  AvailableNft,
  BlueprintOrPuzzleNft,
  MaterialNft,
} from "../../Data/DTOs/DealNftDTO";
import { useLocation, useNavigate } from "react-router-dom";

function DrTwo() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const selectedOfferNfts = useLocation().state;

  const [nftsRequest, setNftsRequest] = useState<AvailableNft[]>([]);
  const [selectedRequestNfts, setSelectedRequestNfts] = useState<
    AvailableNft[]
  >([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const params = {
          count: 50,
          page: 0,
        };
        const responseRequest = await axios.get(
          `${RequestUrl}/v1/nft-exchange/available-nfts-to-request`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: params,
          }
        );

        if (responseRequest.data.result) {
          console.log("Response nftRequest", responseRequest.data.data);
          const updatedNftsRequest = responseRequest.data.data.list.map(
            (nft: AvailableNft) => ({
              ...nft,
              quantity: nft.nftInfo.availableQuantity,
            })
          );
          setNftsRequest(updatedNftsRequest);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [RequestUrl]);

  const handleRequestNftClick = (nft: AvailableNft) => {
    setSelectedRequestNfts((prevSelected) =>
      prevSelected.includes(nft)
        ? prevSelected.filter((selectedNft) => selectedNft !== nft)
        : [...prevSelected, nft]
    );
  };

  const updateQuantity = (nft: AvailableNft, newQuantity: number) => {
    setNftsRequest((prevNftsRequest) =>
      prevNftsRequest.map((item) =>
        item === nft ? { ...item, quantity: newQuantity } : item
      )
    );
    setSelectedRequestNfts((prevSelected) =>
      prevSelected.map((item) =>
        item === nft ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (nft: AvailableNft) => {
    const newQuantity = Math.min(
      nft.quantity + 1,
      nft.nftInfo.availableQuantity
    );
    updateQuantity(nft, newQuantity);
  };

  const decreaseQuantity = (nft: AvailableNft) => {
    const newQuantity = Math.max(nft.quantity - 1, 1);
    updateQuantity(nft, newQuantity);
  };

  const renderNfts = (
    nfts: AvailableNft[],
    selectedNfts: AvailableNft[],
    handleClick: (nft: AvailableNft) => void
  ) => {
    return nfts.map((nft, index) => {
      const isSelected = selectedNfts.includes(nft);
      return (
        <div
          key={index}
          className={`nft-item ${isSelected ? "selected" : ""}`}
          onClick={() => handleClick(nft)}
        >
          <p>{setNftName(nft)}</p>
          <div className="quantity-controls">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decreaseQuantity(nft);
              }}
              disabled={isSelected}
              className={isSelected ? "disabled" : ""}
            >
              -
            </button>
            <span>{nft.quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                increaseQuantity(nft);
              }}
              disabled={isSelected}
              className={isSelected ? "disabled" : ""}
            >
              +
            </button>
          </div>
        </div>
      );
    });
  };

  const setNftName = (nft: AvailableNft): string => {
    if (nft.type === "material") {
      return (nft.nftInfo as MaterialNft).name;
    } else if (nft.type === "blueprint") {
      return `[${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName}] 
        설계도면(${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName})`;
    } else {
      return `[${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName}]
      조각(${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName})`;
    }
  };

  return (
    <div className="DrTwo">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_nftRequest">
        <h3>2단계: 받고 싶은 NFT 선택</h3>
        <div className="nftRequest_main">
          {renderNfts(nftsRequest, selectedRequestNfts, handleRequestNftClick)}
        </div>
      </div>
      <div>
        <h3>선택된 NFT:</h3>
        {selectedRequestNfts.map((nft, index) => (
          <p key={index}>
            {index + 1}. {setNftName(nft)} (수량: {nft.quantity})
          </p>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>이전</button>
      <button
        onClick={() =>
          navigate("/deal/regist/stepThree", {
            state: { selectedOfferNfts, selectedRequestNfts },
          })
        }
      >
        선택 완료
      </button>
    </div>
  );
}

export default DrTwo;
