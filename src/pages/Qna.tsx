import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

function Qna() {
  return (
    <div className="Qna">
      <MyHeader headerText="1:1 문의하기" leftChild={<MyButton />} />
    </div>
  );
}

export default Qna;
