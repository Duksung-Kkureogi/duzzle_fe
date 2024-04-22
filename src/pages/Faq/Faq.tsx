
import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import FaqViewer from "./FaqViewer";

function Faq() {
  return (
    <div className="Faq">
      <MyHeader headerText="자주하는 질문" leftChild={<MyButton />} />
      <FaqViewer />
    </div>
  );
}

export default Faq;

