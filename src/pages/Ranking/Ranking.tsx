import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Ranking.css";

interface UserRanking {
  rank: number;
  name: string;
  walletAddress: string;
  nftHoldings: number;
  nftHoldingsPercentage: number;
}

const Ranking: React.FC = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [myRank, setMyRank] = useState<UserRanking | null>(null);
  const navigate = useNavigate();
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // api 임시 주석처리
        // const response = await axios.get(
        //   `${RequestURL}/v1/rankings/current-season`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        const list = response.data.data.list;

        // 보유량 기준 순위
        list.sort(
          (a: UserRanking, b: UserRanking) => b.nftHoldings - a.nftHoldings
        );

        // 순위부여, 동일순위 부여
        let currentRank = 1;
        list.forEach((item: UserRanking, index: number) => {
          if (index > 0 && list[index - 1].nftHoldings === item.nftHoldings) {
            item.rank = list[index - 1].rank; // 동일 순위 부여
          } else {
            item.rank = currentRank;
          }
          currentRank++;
        });

        const myWalletAddress = "MY_WALLET_ADDRESS"; //내 지갑 주소
        const myRanking =
          list.find((item) => item.walletAddress === myWalletAddress) || null;

        setRankings(list);
        setMyRank(myRanking);
      } catch (error) {
        console.error("Error fetching rankings:", error);

        // Mock 데이터
        const mockRankings: UserRanking[] = [
          {
            rank: 1,
            name: "나는덕새",
            walletAddress: "address1",
            nftHoldings: 25,
            nftHoldingsPercentage: 16,
          },
          {
            rank: 2,
            name: "더즐킹",
            walletAddress: "address2",
            nftHoldings: 24,
            nftHoldingsPercentage: 16,
          },
          {
            rank: 3,
            name: "컴공생임다",
            walletAddress: "address3",
            nftHoldings: 19,
            nftHoldingsPercentage: 12,
          },
          {
            rank: 4,
            name: "퍼즐지망생",
            walletAddress: "address4",
            nftHoldings: 18,
            nftHoldingsPercentage: 11,
          },
          {
            rank: 6,
            name: "더즐",
            walletAddress: "address6",
            nftHoldings: 26,
            nftHoldingsPercentage: 11,
          },
          {
            rank: 7,
            name: "가나다",
            walletAddress: "address7",
            nftHoldings: 18,
            nftHoldingsPercentage: 11,
          },
          {
            rank: 8,
            name: "난보유많이",
            walletAddress: "address8",
            nftHoldings: 18,
            nftHoldingsPercentage: 11,
          },
          {
            rank: 9,
            name: "덕성짱",
            walletAddress: "address9",
            nftHoldings: 18,
            nftHoldingsPercentage: 11,
          },
          {
            rank: 126,
            name: "내가짱먹어",
            walletAddress: "MY_WALLET_ADDRESS",
            nftHoldings: 3,
            nftHoldingsPercentage: 0.02,
          },
        ];

        const myWalletAddress = "MY_WALLET_ADDRESS"; //내 지갑 주소
        const myRanking =
          mockRankings.find((item) => item.walletAddress === myWalletAddress) ||
          null;

        setRankings(mockRankings);
        setMyRank(myRanking);
      }
    };

    fetchRankings();
  }, [RequestURL, token]);

  const handleMyRankClick = () => {
    if (myRank) {
      const element = document.getElementById(`rank-${myRank.rank}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="c_ranking">
      <h1 className="title">시즌 순위</h1>
      <div className="top-ranking">
        {rankings.slice(0, 3).map((user, index) => {
          const imageSrc = [
            "/src/pages/Ranking/duk1.png",
            "/src/pages/Ranking/duk2.png",
            "/src/pages/Ranking/duk3.png",
          ][index];

          return (
            <div key={index} className={`podium-rank rank-${index + 1}`}>
              <img src={imageSrc} alt={`순위 ${index + 1}`} />
              <div className="podium-name">{user.name}</div>
              <div className="podium-position">{index + 1}위</div>
            </div>
          );
        })}
      </div>
      {myRank && (
        <div className="my-ranking">
          <button onClick={handleMyRankClick}>
            내 순위: {myRank.rank}위 ({myRank.name})
          </button>
        </div>
      )}
      <div className="ranking-chart">
        {rankings.map((user) => (
          <div
            key={user.rank}
            id={`rank-${user.rank}`}
            className="ranking-item"
          >
            <span className="rank">{user.rank}위</span>
            <span className="name">{user.name}</span>
            <span className="nft-holdings">{user.nftHoldings}개</span>
            <span className="nft-percentage">
              {user.nftHoldingsPercentage >= 1
                ? `${user.nftHoldingsPercentage}%`
                : `${user.nftHoldingsPercentage.toFixed(2)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
