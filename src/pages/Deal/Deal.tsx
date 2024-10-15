import { useState, useEffect, useCallback } from "react";
import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";
import { DealApis, GetDealQueryParams } from "../../services/api/deal.api";
import { Deal, NftExchangeOfferStatus } from "../../Data/DTOs/Deal";
import DealList from "./DealList";
import SearchSection from "./SearchSectionComponent";
import RPC, { ApprovalStatus } from "../../../ethersRPC";
import { useAuth } from "../../services/AuthContext";
import { IProvider } from "@web3auth/base";
import ApprovalModal from "../../components/Modal/ApprovalModal";
import LoginModal from "../../components/Modal/LoginModal";
interface SearchParams {
  user: string;
  providedNft: string;
  requestedNft: string;
}

const DealPage = () => {
  const { web3auth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({});
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);

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

  const checkApprovalStatus = useCallback(async () => {
    if (isAuthenticated && web3auth?.provider) {
      const rpc = new RPC(web3auth.provider as IProvider);
      const status = await rpc.checkApprovalStatus();

      setApprovalStatus(status);
      const allApproved = Object.values(status).every((item) => item.approved);
      setIsApproved(allApproved);
    }
  }, [isAuthenticated, web3auth]);

  useEffect(() => {
    checkApprovalStatus();
  }, [checkApprovalStatus]);

  const handleNewTrade = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else if (!isApproved) {
      setShowApprovalModal(true);
    } else {
      navigate("/nft-exchange/regist/stepOne");
    }
  };

  const handleApprove = async (contractAddress: string) => {
    if (web3auth?.provider && !isApprovalLoading) {
      setIsApprovalLoading(true);
      try {
        const rpc = new RPC(web3auth.provider as IProvider);
        const success = await rpc.setApprovalForAll(contractAddress, true);
        if (success) {
          // 즉시 상태 업데이트
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [contractAddress]: {
              ...prevStatus[contractAddress],
              approved: true,
            },
          }));
        } else {
          console.error("Approval failed");
        }
      } catch (error) {
        console.error("Approval error:", error);
      } finally {
        setIsApprovalLoading(false);
      }
    }
  };

  const handleRevoke = async (contractAddress: string) => {
    if (web3auth?.provider && !isApprovalLoading) {
      setIsApprovalLoading(true);
      try {
        const rpc = new RPC(web3auth.provider as IProvider);
        const success = await rpc.revokeApproval(contractAddress);
        if (success) {
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [contractAddress]: {
              ...prevStatus[contractAddress],
              approved: false,
            },
          }));
        } else {
          console.error("Revocation failed");
        }
      } catch (error) {
        console.error("Revocation error:", error);
      } finally {
        setIsApprovalLoading(false);
      }
    }
  };

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

        const response =
          isMyTrades && isAuthenticated()
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
        isAuthenticated={isAuthenticated()}
        handleNewTrade={handleNewTrade}
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
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => navigate("/login")}
      />
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        approvalStatus={approvalStatus}
        onApprove={handleApprove}
        onRevoke={handleRevoke}
        isLoading={isApprovalLoading}
      />
    </div>
  );
};

export default DealPage;
