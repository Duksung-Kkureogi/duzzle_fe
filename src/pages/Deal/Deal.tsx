import { useState, useEffect, useCallback } from "react";
import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";
import { DealApis, GetDealQueryParams } from "../../services/api/deal.api";
import { Deal, NftExchangeOfferStatus } from "../../Data/DTOs/Deal";
import DealList from "./DealList";
import SearchSection from "./SearchSectionComponent";

interface SearchParams {
  user: string;
  providedNft: string;
  requestedNft: string;
}

const DealPage = () => {
  const navigate = useNavigate();
  const [registeredTrades, setRegisteredTrades] = useState<Deal[]>([]);
  const [registeredTradesTotal, setRegisteredTradesTotal] = useState(0);
  const [myTrades, setMyTrades] = useState<Deal[]>([]);
  const [myTradesTotal, setMyTradesTotal] = useState(0);
  const [status, setStatus] = useState<NftExchangeOfferStatus>(undefined);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    user: "",
    providedNft: "",
    requestedNft: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const tradesPerPage = 2;

  const fetchTrades = useCallback(
    async (isMyTrades: boolean) => {
      try {
        const params: GetDealQueryParams = {
          count: tradesPerPage,
          page: (isMyTrades ? myCurrentPage : currentPage) - 1,
          status,
          requestedNfts: searchParams.requestedNft,
          offeredNfts: searchParams.providedNft,
          offerorUser: searchParams.user,
        };

        const response = isMyTrades
          ? await DealApis.getMyOffers(params)
          : await DealApis.getNftExchangeOffers(params);

        if (isMyTrades) {
          setMyTrades(response.list);
          setMyTradesTotal(
            Math.max(Math.ceil(response.total / tradesPerPage), 1)
          );
        } else {
          setRegisteredTrades(response.list);
          setRegisteredTradesTotal(
            Math.max(Math.ceil(response.total / tradesPerPage), 1)
          );
        }
      } catch (error) {
        console.error(
          `Error fetching ${isMyTrades ? "my " : ""}trades:`,
          error
        );
      }
    },
    [currentPage, myCurrentPage, status, searchParams]
  );

  useEffect(() => {
    fetchTrades(false);
    fetchTrades(true);
  }, [fetchTrades]);

  // // 전체 페이지 수 계산
  // const totalPages = Math.max(
  //   Math.ceil(registeredTradesTotal / tradesPerPage),
  //   1
  // );
  // const totalMyPages = Math.max(
  //   Math.ceil(myTradesTotal / tradesPerPage) || 1,
  //   1
  // );

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setMyCurrentPage(1);
  };

  return (
    <div className="Deal">
      <SearchSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleSearch={handleSearch}
        handleStatusChange={handleStatusChange}
        status={status}
        navigate={navigate}
      />
      <DealList
        title="등록된 거래 목록"
        deals={registeredTrades}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={registeredTradesTotal}
      />
      <DealList
        title="내가 등록한 거래"
        deals={myTrades}
        currentPage={myCurrentPage}
        setCurrentPage={setMyCurrentPage}
        totalPages={myTradesTotal}
      />
      <MyBottomNavBar />
    </div>
  );
};

export default DealPage;
