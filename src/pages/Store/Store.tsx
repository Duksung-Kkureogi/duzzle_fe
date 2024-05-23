import { useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import Modal from "react-modal";
import "./Store.css";

function Store() {
  const user_dal = 24;
  const [modalOpen, setModalOpen] = useState(false);

  function openModal() {
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
        <p>{user_dal} Dal</p>
      </div>
      <div className="store_main">
        <button className="store_gift" onClick={openModal}>
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
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <button onClick={closeModal}>X</button>
        <div>
          <h2>Dal이 부족합니다!</h2>
          <h2>랜덤 퀘스트를 통해 Dal을 획득해보세요.</h2>
          <button>퀘스트 하러가기</button>
        </div>
      </Modal>
    </div>
  );
}

export default Store;
