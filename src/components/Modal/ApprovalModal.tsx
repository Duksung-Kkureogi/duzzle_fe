import React, { useEffect } from "react";
import "./Modal.css";
import { ApprovalStatus } from "../../../ethersRPC";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalStatus: ApprovalStatus;
  onApprove: (contractAddress: string) => Promise<void>;
  onRevoke: (contractAddress: string) => Promise<void>;
  isLoading: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  approvalStatus,
  onApprove,
  onRevoke,
  isLoading,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allApproved = Object.values(approvalStatus).every(
    (item) => item.approved
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">토큰 승인 상태</h2>
        {Object.entries(approvalStatus).map(([address, { name, approved }]) => (
          <div key={address} className="approval-item">
            <div>
              <span className="token-name">{name}</span>
              <span
                className={`approval-status ${
                  approved ? "approved" : "not-approved"
                }`}
              >
                {approved ? " (승인됨)" : " (미승인)"}
              </span>
            </div>
            <button
              className={`button ${
                approved ? "button-revoke" : "button-approve"
              }`}
              onClick={() =>
                approved ? onRevoke(address) : onApprove(address)
              }
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : approved ? "승인 취소" : "승인하기"}
            </button>
          </div>
        ))}
        {allApproved ? (
          <button
            className="button submit-button"
            onClick={onClose}
            disabled={isLoading}
          >
            거래 등록하기
          </button>
        ) : (
          <p>모든 토큰을 승인해야 거래를 등록할 수 있습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ApprovalModal;
