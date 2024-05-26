import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import Modal from "react-modal";
import "./Store.css";

import { useAuth } from "../../services/AuthContext";
import RPC from "../../../ethersRPC";
import { IProvider } from "@web3auth/base";
import Loading from "../../components/Loading/Loading";
import { itemList } from "../../util/item";

function Store() {
  const { web3auth, getDalBalance, web3AuthInit } = useAuth();
  const [userDal, setUserDal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [enoughDal, setEnoughDal] = useState(false);

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
      const balance = await getDalBalance();
      setUserDal(balance);
      //setUserDal("1");
    };
    fetchUserDal();
  }, [getDalBalance]);

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
    if (Number(userDal) > 2) {
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
      height: "220px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#F69EBB",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
  };

  return (
    <div className="Store">
      <MyHeader headerText="상점" leftChild={<MyButton />} />
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
      {enoughDal ? (
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          style={customStyles}
          shouldCloseOnOverlayClick={false}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <button onClick={closeModal}>X</button>
              <div>
                <div style={{ textAlign: "center" }}>
                  <h3>{curNFTItem?.item_name}</h3>
                  <img src={curNFTItem?.item_img} style={{ width: "100px" }} />
                </div>
                <div>
                  <button>보유 NFT 확인</button>
                  <button>잠금해제 하러 가기</button>
                </div>
              </div>
            </>
          )}
        </Modal>
      ) : (
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          style={customStyles}
          shouldCloseOnOverlayClick={false}
        >
          <button onClick={closeModal}>X</button>
          <div>
            <h2>Dal이 부족합니다!</h2>
            <h2>랜덤 퀘스트를 통해 Dal을 획득해보세요.</h2>
            <button>퀘스트 하러가기</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Store;
