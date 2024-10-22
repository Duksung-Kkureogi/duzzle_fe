import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DealApis } from "../../services/api/deal.api";
import "./DealDetail.css";
import {
  Deal,
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferStatus,
} from "../../Data/DTOs/Deal";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<Deal | null>(null);
  const [isMine, setIsMine] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myWalletAddress = localStorage.getItem("walletAddress");

    const fetchDetail = async () => {
      try {
        // TODO: 현재 API 없음
        setTrade({
          id: parseInt(id),
          offerorUser: {
            walletAddress: "",
            name: "",
            image: "",
          },
          requestedNfts: [],
          offeredNfts: [],
          status: NftExchangeOfferStatus.LISTED,
          createdAt: new Date(),
        });

        // const response = await DealApis.getDetails(id);
        // setTrade(response);
        // setIsMine(
        //   myWalletAddress &&
        //     response.offerorUser.walletAddress === myWalletAddress
        // );
      } catch (error) {
        console.error("Error fetching trade details:", error);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleAcceptExchange = async () => {
    setError(null);
    try {
      await DealApis.acceptNftExchangeOffer(id);
      // 성공 처리 (예: 성공 메시지 표시, 페이지 리다이렉트 등)
      navigate("/nft-exchange", {
        state: { message: "교환이 성공적으로 완료되었습니다." },
      });
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 404:
            setError(`거래를 찾을 수 없습니다. (ID: ${id})`);
            break;
          case 400:
            if (data.code === "INSUFFICIENT_NFT") {
              setError(`NFT 부족: ${data.message}`);
            } else {
              setError("잘못된 요청입니다.");
            }
            break;
          case 409:
            setError(
              "거래 취소: 현재 제안자가 제안한 NFT를 보유하고 있지 않아 거래를 진행할 수 없습니다."
            );
            break;
          case 403:
            setError("자신이 등록한 교환 거래는 승인할 수 없습니다.");
            break;
          default:
            setError("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      } else {
        setError(
          "네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해 주세요."
        );
      }
    }
  };

  const handleButtonClick = async () => {
    if (isMine) {
      // 거래 취소 로직
      console.log("거래 취소");
      await DealApis.cancelNftExchangeOffer(id);
    } else {
      handleAcceptExchange();
    }
  };

  if (!trade)
    return (
      <div className="nft-exchange-error">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <p>NFT 교환 정보를 불러올 수 없습니다.</p>
      </div>
    );

  const getSeasonEmoji = (seasonName: string) => {
    switch (seasonName) {
      case "봄":
        return "🌸";
      case "크리스마스":
        return "🎄";
      default:
        return "❤️";
    }
  };

  const renderNftName = (
    nft: ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT
  ) => {
    if (nft["seasonName"]) {
      return (
        <p className="ree2">
          [{getSeasonEmoji(nft["seasonName"])}] {nft["zoneName"]}
        </p>
      );
    }
    return <p className="ree2">{nft["name"]}</p>;
  };

  return (
    <div className="nft-exchange-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ←
      </button>
      <h2>NFT 교환 상세</h2>
      <div className="nft-section">
        <h3>제공 NFT</h3>
        {trade.offeredNfts.map((nft, index) => (
          <div key={index} className="nft-item">
            <img src={nft.imageUrl} />
            <div className="nft-info">
              {renderNftName(nft)}
              <p>수량: {nft.quantity}개</p>
            </div>
          </div>
        ))}
      </div>
      <div className="nft-section">
        <h3>요청 NFT</h3>
        {trade.requestedNfts.map((nft, index) => (
          <div key={index} className="nft-item">
            <img src={nft.imageUrl} />
            <div className="nft-info">
              {renderNftName(nft)}
              <p>수량: {nft.quantity}개</p>
            </div>
          </div>
        ))}
      </div>
      <div className="token-history">
        <h3>토큰 히스토리</h3>
        {/* 토큰 히스토리 표시 로직 */}
        <table className="history-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>View more</th>
            </tr>
          </thead>
          <tbody>{/* 여기에 토큰 히스토리 데이터를 매핑하여 표시 */}</tbody>
        </table>
      </div>
      <button className="action-button" onClick={handleButtonClick}>
        {isMine ? "거래 취소하기" : "제안 수락하기"}
      </button>
      {error && <Error message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default DealDetail;
