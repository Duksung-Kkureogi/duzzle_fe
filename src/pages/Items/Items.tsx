/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Items.css";

function Items() {
  const [totalItems, setTotalItems] = useState(18);
  const [blueprint, setBlueprint] = useState(2);
  const [redbrick, setRedbrick] = useState(7);
  const [glass, setGlass] = useState(3);
  const [sand, setSand] = useState(5);
  const [hammer, setHammer] = useState(1);

  return (
    <div className="Items">
      <MyHeader headerText="아이템 NFT" leftChild={<MyButton />} />
      <div className="items_title">
        <p>나의 아이템</p>
      </div>
      <div className="items_total">
        <img src="/src/assets/images/item.png" />
        <p>{totalItems} Items</p>
      </div>
      <div className="items_main">
        <div className="item blueprint">
          <img src="/src/assets/images/blueprint.png" />
          <p>설계도</p>
          <p>수량 : {blueprint}</p>
        </div>
        <div className="item brick">
          <img src="/src/assets/images/brick.png" />
          <p>설계도</p>
          <p>수량 : {redbrick}</p>
        </div>
        <div className="item glass">
          <img src="/src/assets/images/glass.png" />
          <p>설계도</p>
          <p>수량 : {glass}</p>
        </div>
        <div className="item sand">
          <img src="/src/assets/images/sand.png" />
          <p>설계도</p>
          <p>수량 : {sand}</p>
        </div>
        <div className="item hammer">
          <img src="/src/assets/images/hammer.png" />
          <p>설계도</p>
          <p>수량 : {hammer}</p>
        </div>
      </div>
      <div className="store_btn">
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="2.0"
          stroke="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          ></path>
        </svg>
        <p>상점</p>
      </div>
    </div>
  );
}

export default Items;
