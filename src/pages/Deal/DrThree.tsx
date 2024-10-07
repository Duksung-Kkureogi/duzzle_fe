import "./DrThree.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AvailableNft,
  MaterialNft,
  BlueprintOrPuzzleNft,
} from "../../Data/DTOs/DealNftDTO";

function DrThree() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const { state } = useLocation();
  const { selectedOfferNfts, selectedRequestNfts } = state as {
    selectedOfferNfts: AvailableNft[];
    selectedRequestNfts: AvailableNft[];
  };

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
      quantity: nft.quantity,
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
        navigate("/deal");
      } else {
        console.log("Exchange failed");
      }
    } catch (error) {
      console.error("Error during exchange:", error);
    }
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
    <div className="DrThree">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_nftExchange">
        <h3>3단계: 제안 검토 및 생성</h3>
      </div>
      <div>
        <div>
          <h3>제공할 NFT:</h3>
          {selectedOfferNfts.map((nft, index) => (
            <p key={index}>
              {setNftName(nft)} (수량: {nft.quantity})
            </p>
          ))}
        </div>
        <div>
          <h3>받고 싶은 NFT:</h3>
          {selectedRequestNfts.map((nft, index) => (
            <p key={index}>
              {setNftName(nft)} (수량: {nft.quantity})
            </p>
          ))}
        </div>
      </div>
      <button onClick={() => navigate(-1)}>이전</button>
      <button onClick={nftExchange}>교환하기</button>
    </div>
  );
}

export default DrThree;
