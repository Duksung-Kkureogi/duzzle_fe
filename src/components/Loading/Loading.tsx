import Spinner from "../../assets/images/spinner.gif";
import "./Loading.css";

interface LoadingProps {
  message?: string;
  subMessage?: string;
}

const Loading = ({
  message = "잠시만 기다려주세요",
  subMessage,
}: LoadingProps) => {
  return (
    <div className="Loading">
      <h3>{message}</h3>
      <img src={Spinner} alt="로딩" width="10%" />
      {subMessage && <p className="sub-message">{subMessage}</p>}
    </div>
  );
};

export default Loading;
