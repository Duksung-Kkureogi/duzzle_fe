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

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          count: 50,
          page: 0,
        };
        const responseOffer = await axios.get(
          RequestUrl + "/v1/nft-exchange/available-nfts-to-offer",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const responseRequest = await axios.get(
          RequestUrl + "/v1/nft-exchange/available-nfts-to-request",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            params: params,
          }
        );
        if (responseOffer.data.result && responseRequest.data.result) {
          console.log("Response nftOffer", responseOffer.data.data);
          console.log("Response nftRequest", responseRequest.data.data);
          setNftsOffer(responseOffer.data.data.list);
          setNftsRequest(responseRequest.data.data.list);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [RequestUrl]);

  return (
    <div className="DealRegist">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_nftOffer">
        <h3>1단계: 제공할 NFT 선택</h3>
        <div className="nftOffer_main">
          {nftsOffer.map(
            (nft, index) =>
              (nft.type === "material" || nft.type === "blueprint") && (
                <div key={index}>
                  <p>
                    {nft.type === "material"
                      ? (nft.nftInfo as MaterialNft).name
                      : `${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName} ${
                          (nft.nftInfo as BlueprintOrPuzzleNft).zoneName
                        }`}{" "}
                    - {nft.nftInfo.availableQuantity}개
                  </p>
                </div>
              )
          )}
        </div>
      </div>
      <div className="dr_nftRequest">
        <h3>2단계: 받고 싶은 NFT 선택</h3>
        <div className="nftRequest_main">
          {nftsRequest.map((nft, index) => (
            <div key={index}>
              <p>
                {nft.type === "material"
                  ? (nft.nftInfo as MaterialNft).name
                  : `${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName} ${
                      (nft.nftInfo as BlueprintOrPuzzleNft).zoneName
                    }`}{" "}
                - {nft.nftInfo.availableQuantity}개
              </p>
            </div>
          ))}
        </div>
      </div>

      <MyBottomNavBar />
    </div>
  );
}

export default DealRegist;
