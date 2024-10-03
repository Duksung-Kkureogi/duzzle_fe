import { useEffect, useState } from "react";
import "./DealRegist.css";
import axios from "axios";
import {
  AvailableNft,
  MaterialNft,
  BlueprintOrPuzzleNft,
} from "../../Data/DTOs/DealNftDTO";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

function DealRegist() {
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const [nftsOffer, setNftsOffer] = useState<AvailableNft[]>([]);
  const [nftsRequest, setNftsRequest] = useState<AvailableNft[]>([]);

  const [selectedOfferNfts, setSelectedOfferNfts] = useState<AvailableNft[]>(
    []
  );
  const [selectedRequestNfts, setSelectedRequestNfts] = useState<
    AvailableNft[]
  >([]);

  const NftInfo = (nft: AvailableNft) => {
    let id: { contractId?: number; seasonZoneId?: number };

    if (nft.type === "material") {
      id = { contractId: (nft.nftInfo as MaterialNft).contractId };
    } else {
      id = { seasonZoneId: (nft.nftInfo as BlueprintOrPuzzleNft).seasonZoneId };
    }

    return {
      type: nft.type,
      ...id,
      quantity: nft.nftInfo.availableQuantity,
    };
  };

  const nftExchange = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const params = {
        offeredNfts: selectedOfferNfts.map(NftInfo),
        requestedNfts: selectedRequestNfts.map(NftInfo),
      };
      const response = await axios.post(
        `${RequestUrl}/v1/nft-exchange`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.result) {
        console.log(response.data);
      } else {
        console.log("Exchange failed");
      }
    } catch (error) {
      console.error("Error during exchange:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const params = {
          count: 50,
          page: 0,
        };
        const [responseOffer, responseRequest] = await Promise.all([
          axios.get(`${RequestUrl}/v1/nft-exchange/available-nfts-to-offer`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(`${RequestUrl}/v1/nft-exchange/available-nfts-to-request`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: params,
          }),
        ]);
        if (responseOffer.data.result && responseRequest.data.result) {
          console.log("Response nftOffer", responseOffer.data.data);
          console.log("Response nftRequest", responseRequest.data.data);
          setNftsOffer(responseOffer.data.data.list);
          setNftsRequest(responseRequest.data.data.list);
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

  const handleRequestNftClick = (nft: AvailableNft) => {
    setSelectedRequestNfts((prevSelected) =>
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
          {nft.type === "material"
            ? (nft.nftInfo as MaterialNft).name
            : `${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName} ${
                (nft.nftInfo as BlueprintOrPuzzleNft).zoneName
              }`}{" "}
          - {nft.nftInfo.availableQuantity}개
        </p>
      </div>
    ));
  };

  return (
    <div className="DealRegist">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_nftOffer">
        <h3>1단계: 제공할 NFT 선택</h3>
        <div className="nftOffer_main">
          {renderNfts(nftsOffer, selectedOfferNfts, handleOfferNftClick)}
        </div>
      </div>
      <div className="dr_nftRequest">
        <h3>2단계: 받고 싶은 NFT 선택</h3>
        <div className="nftRequest_main">
          {renderNfts(nftsRequest, selectedRequestNfts, handleRequestNftClick)}
        </div>
      </div>
      <button onClick={nftExchange}>교환하기</button>
      <MyBottomNavBar />
    </div>
  );
}

export default DealRegist;
