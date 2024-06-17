import React, { useEffect, useState } from "react";

export enum ToastType {
  Success,
  Error,
  Warning,
}

export interface ToastProps {
  message: string;
  type: ToastType;
}

export const ToastComponent: React.FC<ToastProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  let backgroundColor: string;
  let textColor: string;
  let boxShadow: string;

  switch (type) {
    case ToastType.Success:
      backgroundColor = "#4CAF50"; // Success: 녹색
      textColor = "#FFFFFF"; // 텍스트 색상
      boxShadow = "0 4px 8px rgba(76, 175, 80, 0.4)"; // 그림자
      break;
    case ToastType.Error:
      backgroundColor = "#F44336"; // Error: 빨강
      textColor = "#FFFFFF"; // 텍스트 색상
      boxShadow = "0 4px 8px rgba(244, 67, 54, 0.4)"; // 그림자
      break;
    case ToastType.Warning:
      backgroundColor = "#FFC107"; // Warning: 노랑
      textColor = "#333333"; // 텍스트 색상
      boxShadow = "0 4px 8px rgba(255, 193, 7, 0.4)"; // 그림자
      break;
    default:
      backgroundColor = "#333"; // 기본: 어두운 회색
      textColor = "#FFFFFF"; // 텍스트 색상
      boxShadow = "0 4px 8px rgba(0, 0, 0, 0.4)"; // 그림자
  }

  const toastStyles: React.CSSProperties = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "15px",
    backgroundColor: visible ? backgroundColor : "transparent",
    color: textColor,
    borderRadius: "10px",
    boxShadow: boxShadow,
    zIndex: 999,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: visible ? 1 : 0,
    animation: visible ? "fadeInOut 3s forwards" : "",
  };

  const animationKeyframes = `
    @keyframes fadeInOut {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      50% {
        opacity: 0.8;
        transform: translateY(-20px);
      }
      100% {
        opacity: 0;
        transform: translateY(-50px);
      }
    }
  `;

  return (
    <div>
      <style>{animationKeyframes}</style>
      <div style={toastStyles}>
        <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>
          {message}
        </p>
      </div>
    </div>
  );
};
