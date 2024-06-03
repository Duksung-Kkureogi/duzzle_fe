import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

function Profile() {
  return (
    <div className="Profile">
      <MyHeader headerText="프로필" leftChild={<MyButton />} />
      <div>
        <p>나의 정보</p>
      </div>
      <div></div>
    </div>
  );
}

export default Profile;
