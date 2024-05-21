import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import "./Store.css";

function Store() {
  const user_dal = 24;

  return (
    <div className="Store">
      <MyHeader headerText="상점" leftChild={<MyButton />} />
      <div className="user_dal">
        <img src="/src/assets/images/moon.png" />
        <p>{user_dal} Dal</p>
      </div>
      <div className="">
        <p>상점...</p>
      </div>
    </div>
  );
}

export default Store;
