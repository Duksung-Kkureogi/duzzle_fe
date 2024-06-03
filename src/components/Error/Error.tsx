import ErrorImg from "../../assets/images/gear.gif";

import "./Error.css";

const Error = () => {
  return (
    <div className="Error">
      <h3>오류가 발생하였습니다</h3>
      <img src={ErrorImg} alt="에러" width="10%" />
    </div>
  );
};

export default Error;
