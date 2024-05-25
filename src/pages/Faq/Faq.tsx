import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import FaqViewer from "./FaqViewer";
import "./Faq.css";

function Faq() {
  return (
    <div className="Faq">
      <MyHeader headerText="자주하는 질문" leftChild={<MyButton />} />
      <div className="Faq_wrapper">
        <FaqViewer />
      </div>
    </div>
  );
}

export default Faq;
