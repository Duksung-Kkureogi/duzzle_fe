import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useState } from "react";
import FQnaItem from "./FQnaItem";

import "./FQnaList.css";

const Fix_QnaList = ({ data }) => {
  const nav = useNavigate();
  const [sortType, setSortType] = useState("latest");

  const onChangeSortType = (e) => {
    setSortType(e.target.value);
  };

  const getSortedData = () => {
    return data.sort((a, b) => {
      if (sortType === "oldest") {
        return Number(a.submitTime) - Number(b.submitTime);
      } else {
        return Number(b.submitTime) - Number(a.submitTime);
      }
    });
  };

  const sortedData = getSortedData();

  return (
    <div className="QnaList">
      <div className="menu_bar">
        <select onChange={onChangeSortType}>
          <option value={"latest"}>최신순</option>
          <option value={"oldest"}>오래된 순</option>
        </select>
        <Button onClick={() => nav("/qnanew")} text={"새 문의 작성"} />
      </div>
      <div className="list_wrapper">
        {sortedData.map((item) => (
          <FQnaItem
            key={item.id}
            id={item.id}
            submitTime={item.createdAt}
            content={item.question}
          />
        ))}
      </div>
    </div>
  );
};

export default Fix_QnaList;
