import { useState, useEffect } from "react";
import axios from "axios";
import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";

const DealPage = () => {
  const navigate = useNavigate();
  const [registeredTrades, setRegisteredTrades] = useState([]);
  const [myTrades, setMyTrades] = useState([]);
  const [status, setStatus] = useState("");
  const [searchParams, setSearchParams] = useState({
    user: "",
    providedNft: "",
    requestedNft: "",
  });
  const [searchQuery, setSearchQuery] = useState({
    user: "",
    providedNft: "",
    requestedNft: "",
  });
  const [mockMode, setMockMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const tradesPerPage = 3;
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");
  const loggedInWalletAddress = localStorage.getItem("walletAddress");

  // mock 데이터
  const mockData = [
    {
      nftExchangeOfferId: "0",
      offerorUser: {
        walletAddress: "0xf7F351B931967f9eA036AB871503F175E9b1Ed1C",
        name: "유저1",
        image: "src/pages/Deal/myImg.png",
      },
      offeredNfts: [
        {
          contractId: "NFT001",
          name: "Offered NFT 1",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/sand-item.png",
          quantity: 2,
        },
      ],
      requestedNfts: [
        {
          contractId: "NFT002",
          name: "Requested NFT 1",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/hammer-item.png",
          quantity: 1,
        },
      ],
      status: "dealing",
      createdAt: "2023-01-01",
    },
    {
      nftExchangeOfferId: "1",
      offerorUser: {
        walletAddress: "0x123",
        name: "유저1",
        image: "src/pages/Deal/myImg.png",
      },
      offeredNfts: [
        {
          contractId: "NFT001",
          name: "Offered NFT 2",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
          quantity: 2,
        },
      ],
      requestedNfts: [
        {
          contractId: "NFT002",
          name: "Requested NFT 1",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
          quantity: 1,
        },
      ],
      status: "dealing",
      createdAt: "2023-01-01",
    },
    {
      nftExchangeOfferId: "2",
      offerorUser: {
        walletAddress: "0x124",
        name: "유저2",
        image: "src/pages/Deal/myImg.png",
      },
      offeredNfts: [
        {
          contractId: "NFT003",
          name: "Offered NFT 2",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
          quantity: 3,
        },
      ],
      requestedNfts: [
        {
          contractId: "NFT004",
          name: "Requested NFT 2",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
          quantity: 2,
        },
      ],
      status: "dealdone",
      createdAt: "2023-01-02",
    },
    {
      nftExchangeOfferId: "3",
      offerorUser: {
        walletAddress: "0x125",
        name: "유저3",
        image: "src/pages/Deal/myImg.png",
      },
      offeredNfts: [
        {
          contractId: "NFT005",
          name: "Offered NFT 3",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/sand-item.png",
          quantity: 1,
        },
      ],
      requestedNfts: [
        {
          contractId: "NFT006",
          name: "Requested NFT 3",
          imageUrl:
            "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/sand-item.png",
          quantity: 3,
        },
      ],
      status: "dealcancel",
      createdAt: "2023-01-03",
    },
  ];

  const fetchTrades = async () => {
    try {
      const params = {
        count: tradesPerPage,
        page: currentPage - 1,
      };

      if (status) params.status = status;
      if (searchQuery.requestedNft)
        params.requestedNfts = searchQuery.requestedNft;
      if (searchQuery.providedNft) params.offeredNfts = searchQuery.providedNft;
      if (searchQuery.user) params.offerorUser = searchQuery.user;

      const response = await axios.get(`${RequestURL}/v1/nft-exchange`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: params,
      });

      console.log("API 응답 데이터:", response.data);
      const trades = response.data.data.list;
      setRegisteredTrades(trades);
      setMockMode(false);
      const myRegisteredTrades = trades.filter(
        (trade) => trade.offerorUser.walletAddress === loggedInWalletAddress
      );
      setMyTrades(myRegisteredTrades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setMockMode(true);

      const myMockTrades = mockData.filter(
        (trade) => trade.offerorUser.walletAddress === loggedInWalletAddress
      );
      setMyTrades(myMockTrades);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [currentPage, status, searchQuery]);

  const filterTrades = (trades) => {
    let filteredTrades = trades;

    if (status) {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.status === status
      );
    }

    if (searchQuery.user) {
      filteredTrades = filteredTrades.filter((trade) =>
        trade.offerorUser && trade.offerorUser.name
          ? trade.offerorUser.name.includes(searchQuery.user)
          : false
      );
    }

    if (searchQuery.providedNft) {
      filteredTrades = filteredTrades.filter((trade) =>
        trade.offeredNfts
          ? trade.offeredNfts.some((nft) =>
              nft.name ? nft.name.includes(searchQuery.providedNft) : false
            )
          : false
      );
    }

    if (searchQuery.requestedNft) {
      filteredTrades = filteredTrades.filter((trade) =>
        trade.requestedNfts
          ? trade.requestedNfts.some((nft) =>
              nft.name ? nft.name.includes(searchQuery.requestedNft) : false
            )
          : false
      );
    }

    return filteredTrades;
  };

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = filterTrades(
    mockMode ? mockData : registeredTrades
  ).slice(indexOfFirstTrade, indexOfLastTrade);

  const indexOfMyLastTrade = myCurrentPage * tradesPerPage;
  const indexOfMyFirstTrade = indexOfMyLastTrade - tradesPerPage;
  const currentMyTrades = filterTrades(myTrades).slice(
    indexOfMyFirstTrade,
    indexOfMyLastTrade
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <=
    Math.ceil(
      filterTrades(mockMode ? mockData : registeredTrades).length /
        tradesPerPage
    );
    i++
  ) {
    pageNumbers.push(i);
  }

  const myPageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filterTrades(myTrades).length / tradesPerPage);
    i++
  ) {
    myPageNumbers.push(i);
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchParams);
  };

  return (
    <div className="Deal">
      {/* 검색 */}
      <div className="search-section">
        <input
          type="text"
          placeholder="등록 유저 검색..."
          value={searchParams.user}
          onChange={(e) =>
            setSearchParams({ ...searchParams, user: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="제공 NFT 검색..."
          value={searchParams.providedNft}
          onChange={(e) =>
            setSearchParams({ ...searchParams, providedNft: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="요청 NFT 검색..."
          value={searchParams.requestedNft}
          onChange={(e) =>
            setSearchParams({ ...searchParams, requestedNft: e.target.value })
          }
        />
        <button onClick={handleSearch}>🔍</button>
        <button onClick={() => navigate("/deal/regist")}>등록</button>
        <select value={status} onChange={handleStatusChange}>
          <option value="">상태</option>
          <option value="dealing">대기중</option>
          <option value="dealdone">거래완료</option>
          <option value="dealcancel">거래취소</option>
        </select>
      </div>
      {/* 등록된 거래 목록 */}
      <div className="trade-list">
        <h3>등록된 거래 목록</h3>
        {currentTrades.map((trade) => (
          <div key={trade.nftExchangeOfferId} className="trade-item">
            <div className="user-info">
              <img
                src={trade.offerorUser.image}
                alt={trade.offerorUser.name}
                style={{ width: "50px", height: "50px" }}
              />
              <p>{trade.offerorUser.name}</p>
              <p>{trade.createdAt}</p>
            </div>
            <div className="nft-info">
              <div className="offered">
                <p>제공:</p>
                {trade.offeredNfts.map((nft, index) => (
                  <div key={index}>
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <p>{nft.name}</p>
                  </div>
                ))}
              </div>
              <div className="requested">
                <p>요청:</p>
                {trade.requestedNfts.map((nft, index) => (
                  <div key={index}>
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <p>{nft.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="status">
              <p>
                {trade.status === "dealing"
                  ? "대기중"
                  : trade.status === "dealdone"
                  ? "거래완료"
                  : "거래취소"}
              </p>
            </div>
          </div>
        ))}
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button key={number} onClick={() => setCurrentPage(number)}>
              {number}
            </button>
          ))}
        </div>
      </div>
      {/* 내가 등록한 거래 목록 */}
      <div className="my-trade-list">
        <h3>내가 등록한 거래</h3>
        {currentMyTrades.map((trade) => (
          <div key={trade.nftExchangeOfferId} className="trade-item">
            <div className="user-info">
              <img
                src={trade.offerorUser.image}
                alt={trade.offerorUser.name}
                style={{ width: "50px", height: "50px" }}
              />
              <p>{trade.offerorUser.name}</p>
              <p>{trade.createdAt}</p>
            </div>
            <div className="nft-info">
              <div className="offered">
                <p>제공:</p>
                {trade.offeredNfts.map((nft, index) => (
                  <div key={index}>
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <p>{nft.name}</p>
                  </div>
                ))}
              </div>
              <div className="requested">
                <p>요청:</p>
                {trade.requestedNfts.map((nft, index) => (
                  <div key={index}>
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <p>{nft.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="status">
              <p>
                {trade.status === "dealing"
                  ? "대기중"
                  : trade.status === "dealdone"
                  ? "거래완료"
                  : "거래취소"}
              </p>
            </div>
          </div>
        ))}
        <div className="pagination">
          {myPageNumbers.map((number) => (
            <button key={number} onClick={() => setMyCurrentPage(number)}>
              {number}
            </button>
          ))}
        </div>
      </div>
      <MyBottomNavBar />
    </div>
  );
};

export default DealPage;
