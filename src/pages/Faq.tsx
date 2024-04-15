import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

function Faq() {
  return (
    <div className="Faq">
      <MyHeader headerText="자주하는 질문" leftChild={<MyButton />} />
    </div>
  );
}

export default Faq;
