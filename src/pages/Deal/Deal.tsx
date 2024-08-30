import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useEffect, useState } from "react";
import { DealList, myDealList } from "./Deal_data";

// 이미지
import tradeImg from "./trade.png";

function Deal() {
  const [deals, setDeals] = useState<Deal[]>([
    { userImg: "", myItem: "", yourItem: "" },
  ]);
  const [myDeals, setMyDeals] = useState<Deal[]>([
    { userImg: "", myItem: "", yourItem: "" },
  ]);

  useEffect(() => {
    setDeals(DealList);
    setMyDeals(myDealList);
  }, []);

  interface Deal {
    userImg: string;
    myItem: string;
    yourItem: string;
  }

  return (
    <div className="Deal">
      <div className="deal_button">
        <button className="searchBtn">검색</button>
        <button className="postBtn">거래등록</button>
      </div>
      <p className="list_title">거래 목록</p>
      <div className="deals_main">
        {deals.map((deal) => (
          <div className="deal">
            <img src={deal.userImg} />
            <div className="deal_trade">
              <img src={deal.myItem} />
              <img src={tradeImg} />
              <img src={deal.yourItem} />
            </div>
          </div>
        ))}
      </div>
      <p className="list_title">내가 등록한 거래</p>
      <div className="deals_main">
        {myDeals.map((deal) => (
          <div className="deal">
            <img src={deal.userImg} />
            <div className="deal_trade">
              <img src={deal.myItem} />
              <img src={tradeImg} />
              <img src={deal.yourItem} />
            </div>
          </div>
        ))}
      </div>

      <MyBottomNavBar />
    </div>
  );
}

export default Deal;
