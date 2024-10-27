/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Deal,
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferStatus,
} from "../../Data/DTOs/Deal";
import "./DealList.css";
import { useNavigate } from "react-router-dom";

interface DealListProps {
  title: string;
  deals: Deal[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const DealList: React.FC<DealListProps> = ({
  title,
  deals,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const navigate = useNavigate();

  const handleDealClick = (id: number) => {
    navigate(`/nft-exchange/${id}`);
  };

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
          [{getSeasonEmoji(nft["seasonName"])}] {nft["zoneName"]} X{" "}
          {nft.quantity}
        </p>
      );
    }
    return <p className="ree2">{`${nft["name"]} X ${nft.quantity}`}</p>;
  };

  const getStatusText = (status: NftExchangeOfferStatus) => {
    switch (status) {
      case NftExchangeOfferStatus.LISTED:
        return "⏰ 거래 가능";
      case NftExchangeOfferStatus.COMPLETED:
        return "✓ 거래 완료";
      case NftExchangeOfferStatus.SYSTEM_CANCELLED:
        return "X 거래 취소";
      case NftExchangeOfferStatus.MATCHED:
      case NftExchangeOfferStatus.PENDING:
        return "⏳ 거래 중";
      default:
        return "⚠️ 거래 불가";
    }
  };

  return (
    <div className="deal-list">
      <h3>{title}</h3>
      {deals &&
        deals.map((Deal) => (
          <div
            key={Deal.id}
            className="deal-item"
            onClick={() => handleDealClick(Deal.id)}
          >
            <div className="deal-content">
              <div className="user-info">
                <img src={Deal.offerorUser.image} alt={Deal.offerorUser.name} />
                <p className="userT">{Deal.offerorUser.name || "이름 없음"}</p>
                <p className="userT1">
                  {new Date(Deal.createdAt).toLocaleString().slice(0, 12)}
                </p>
              </div>
              <div className="speech-bubble">
                <div className={`status-badge ${Deal.status}`}>
                  <p>{getStatusText(Deal.status)}</p>
                </div>
                <div className="nft-info">
                  <div className="offered">
                    <p className="off1">바꿔요:</p>
                    {Deal.offeredNfts.map((nft, index) => (
                      <div key={index} className="nft-item">
                        <img src={nft.image} />
                        {renderNftName(nft)}
                      </div>
                    ))}
                  </div>
                  <div className="requested">
                    <p className="ree1">주세요:</p>
                    {Deal.requestedNfts.map((nft, index) => (
                      <div key={index} className="nft-item">
                        <img src={nft.image} />
                        {renderNftName(nft)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="pagination">
        {totalPages
          ? [...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))
          : "등록된 거래가 없습니다."}
      </div>
    </div>
  );
};

export default DealList;
