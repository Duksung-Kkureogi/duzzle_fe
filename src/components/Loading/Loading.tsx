import Spinner from "../../assets/images/spinner.gif";

import "./Loading.css";

const Loading = () => {
  return (
    <div className="Loading">
      <h3>잠시만 기다려주세요</h3>
      <img src={Spinner} alt="로딩" width="10%" />
    </div>
  );
};

export default Loading;
