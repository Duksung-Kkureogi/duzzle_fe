import React from "react";
import "./Modal.css";

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
  if (!isOpen) return null;

  return (
    <div className="login-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">로그인</h2>
          <p>거래를 등록하려면 로그인이 필요합니다.</p>
          <button className="button submit-button" onClick={onLogin}>
            로그인
          </button>
          <button className="button cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
