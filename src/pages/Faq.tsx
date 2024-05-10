import MyButton from "../components/MyButton/MyButton";
import MyHeader from "../components/MyHeader/MyHeader";

function Faq() {
  return (
    <div className="Faq">
      <MyHeader headerText="자주하는 질문" leftChild={<MyButton />} />
    </div>
  );
}

export default Faq;
