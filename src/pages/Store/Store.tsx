import { useEffect, useState } from "react";
import Modal from "react-modal";
import "./Store.css";

import { useAuth } from "../../services/AuthContext";
import RPC from "../../../ethersRPC";
import { IProvider } from "@web3auth/base";
import { itemList } from "../../util/item";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

function Store() {
  const { web3auth, web3AuthInit, getDal } = useAuth();
  const [userDal, setUserDal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [enoughDal, setEnoughDal] = useState(false);
  const [boughtNFT, setBoughtNFT] = useState(false);

  const [metadataUrl, setMetadataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [curNFTItem, setCurNFTItem] = useState<NFTItem | null>(null);

  interface NFTItem {
    metadata_name: string;
    item_name: string;
    item_img: string;
  }

  useEffect(() => {
    if (!web3auth) {
      web3AuthInit();
    }
  }, [web3auth, web3AuthInit]);

  useEffect(() => {
    const fetchUserDal = async () => {
      const balance = await getDal();
      setUserDal(balance);
      //setUserDal(0);
    };
    fetchUserDal();
  }, [getDal]);

  useEffect(() => {
    if (metadataUrl) {
      getNFTItem();
    }
  }, [metadataUrl]);

  const getRandomItem = async () => {
    const rpc = new RPC(web3auth?.provider as IProvider);
    setLoading(true);
    try {
      const itemMetadataUrl = await rpc.getRandomItem();
      setMetadataUrl(itemMetadataUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getNFTItem = async () => {
    try {
      const response = await fetch(metadataUrl);
      console.log(response);
      if (response.type === "cors") {
        setBoughtNFT(true);
      }
      const data = await response.json();
      const foundNFTItem = itemList.find(
        (it) => it.metadata_name === data.name
      );
      if (foundNFTItem) {
        setCurNFTItem(foundNFTItem);
      } else {
        setCurNFTItem(null);
      }
    } catch (error) {
      console.log(error);
      setCurNFTItem(null);
    }
  };

  function buyItem() {
    if (userDal >= 2) {
      setEnoughDal(true);
      getRandomItem();
      getNFTItem();
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "350px",
      height: "300px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#F69EBB",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
  };

  return (
    <div className="Store">
      <p className="store_title">상점</p>
      <div className="user_dal">
        <img src="/src/assets/images/moon.png" />
        <p>{userDal} Dal</p>
      </div>
      <div className="store_main">
        <button className="store_gift" onClick={buyItem}>
          <img src="/src/assets/images/gift.png" />
        </button>
        <div className="gift_dal">
          <img src="/src/assets/images/moon.png" />
          <p>2 Dal</p>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        {enoughDal ? (
          loading ? (
            <Loading />
          ) : boughtNFT ? (
            <div className="modal_dalO">
              <div className="dal_btn_X">
                <button onClick={closeModal}>X</button>
              </div>
              <div className="dalO_p">
                <p>재료 NFT 구입 완료!</p>
              </div>
              <div className="dalO_item">
                <img src={curNFTItem?.item_img} />
                <p>{curNFTItem?.item_name}</p>
              </div>
              <div className="dalO_btn">
                <button>보유 NFT 확인</button>
                <button>
                  잠금해제<br></br>하러 가기
                </button>
              </div>
            </div>
          ) : (
            <Error />
          )
        ) : (
          <div className="modal_dalX">
            <div className="dal_btn_X">
              <button onClick={closeModal}>X</button>
            </div>
            <div className="dalX_p">
              <p>DAL 이 부족합니다!</p>
              <p>랜덤 퀘스트를 통해 DAL 을 </p>
              <p>획득해보세요.</p>
            </div>
            <div className="dalX_btn">
              <button>퀘스트 하러가기</button>
            </div>
          </div>
        )}
      </Modal>
      <MyBottomNavBar />
    </div>
  );
}

export default Store;
