import React from "react";
import Modal from "./Modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>로그인이 필요합니다</h2>
      <p>거래를 등록하려면 로그인해야 합니다.</p>
      <button onClick={onLogin}>로그인</button>
    </Modal>
  );
};

export default LoginModal;
