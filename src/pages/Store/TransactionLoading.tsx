import Spinner from "../../assets/images/spinner.gif";
import "./TransactionLoading.css";

interface TransactionLoadingProps {
  message: string;
}

const TransactionLoading = ({ message }: TransactionLoadingProps) => {
  const getStepDetails = (message: string) => {
    if (
      message.includes("트랜잭션 시작") ||
      message.includes("트랜잭션을 전송")
    ) {
      return {
        step: 1,
        icon: "💰",
        title: "DAL 토큰 소각",
        description: "스마트 컨트랙트로 전송",
      };
    }
    if (message.includes("처리되고 있습니다")) {
      return {
        step: 2,
        icon: "🎁",
        title: "NFT 생성",
        description: "랜덤 NFT 생성 중",
      };
    }
    return {
      step: 1,
      icon: "💰",
      title: "DAL 토큰 소각",
      description: "스마트 컨트랙트로 전송",
    };
  };

  const currentStep = getStepDetails(message);

  const steps = [
    {
      step: 1,
      icon: "💰",
      title: "DAL 토큰 소각",
      description: "스마트 컨트랙트로 전송",
    },
    { step: 2, icon: "🎁", title: "NFT 생성", description: "랜덤 NFT 생성 중" },
    { step: 3, icon: "✨", title: "정보 확인", description: "NFT 정보 확인" },
  ];

  return (
    <div className="transaction-loading">
      <div className="loading-message">
        <img src={Spinner} alt="로딩" className="spinner" />
        <p>{message}</p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`step ${step.step === currentStep.step ? "active" : ""} 
                       ${step.step < currentStep.step ? "completed" : ""}`}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="exchange-info">
        <span>💎 2 DAL</span>
        <span>→</span>
        <span>🎁 랜덤 NFT</span>
      </div>
    </div>
  );
};

export default TransactionLoading;
