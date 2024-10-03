import "./DrOne.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  AvailableNft,
  BlueprintOrPuzzleNft,
  MaterialNft,
} from "../../Data/DTOs/DealNftDTO";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";

function DrOne() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const [nftsOffer, setNftsOffer] = useState<AvailableNft[]>([]);
  const [selectedOfferNfts, setSelectedOfferNfts] = useState<AvailableNft[]>(
    []
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const responseOffer = await axios.get(
          `${RequestUrl}/v1/nft-exchange/available-nfts-to-offer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (responseOffer.data.result) {
          console.log("Response nftOffer", responseOffer.data.data);
          setNftsOffer(responseOffer.data.data.list);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [RequestUrl]);

  const handleOfferNftClick = (nft: AvailableNft) => {
    setSelectedOfferNfts((prevSelected) =>
      prevSelected.includes(nft)
        ? prevSelected.filter((selectedNft) => selectedNft !== nft)
        : [...prevSelected, nft]
    );
  };

  const renderNfts = (
    nfts: AvailableNft[],
    selectedNfts: AvailableNft[],
    handleClick: (nft: AvailableNft) => void
  ) => {
    return nfts.map((nft, index) => (
      <div
        key={index}
        className={`nft-item ${selectedNfts.includes(nft) ? "selected" : ""}`}
        onClick={() => handleClick(nft)}
      >
        <p>
          {setNftName(nft)} - {nft.nftInfo.availableQuantity}개
        </p>
      </div>
    ));
  };

  const setNftName = (nft: AvailableNft): string => {
    if (nft.type === "material") {
      return (nft.nftInfo as MaterialNft).name;
    } else if (nft.type === "blueprint") {
      return `설계도면 ${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName} 
        ${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName}`;
    } else {
      return `조각 ${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName} 
        ${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName}`;
    }
  };

  return (
    <div className="DrOne">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_nftOffer">
        <h3>1단계: 제공할 NFT 선택</h3>
        <div className="nftOffer_main">
          {renderNfts(nftsOffer, selectedOfferNfts, handleOfferNftClick)}
        </div>
      </div>
      <div>
        <h3>선택된 NFT:</h3>
        {selectedOfferNfts.map((nft, index) => (
          <p key={index}>
            {setNftName(nft)} - {nft.nftInfo.availableQuantity}개
          </p>
        ))}
      </div>

      <button
        onClick={() =>
          navigate("/deal/regist/stepTwo", { state: selectedOfferNfts })
        }
      >
        다음: 받고 싶은 NFT 선택
      </button>
      <MyBottomNavBar />
    </div>
  );
}

export default DrOne;
