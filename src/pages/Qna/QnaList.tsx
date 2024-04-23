import Button from "./Button";
import "./QnaList.css";
import QnaItem from "./QnaItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const QnaList = ({data}) => {
    const nav = useNavigate();
    const [sortType, setSortType] = useState("latest");

    const onChangeSortType = (e) => {
        setSortType(e.target.value);
    }

    const getSortedData = () => {
        return data.sort((a, b) => {
            if (sortType === 'oldest') {
                return Number(a.submitTime) - Number(b.submitTime);
            } else {
                return Number(b.submitTime) - Number(a.submitTime);
            }
        });
    }

    const sortedData = getSortedData();

    return(
    <div className="QnaList">
        <div className="menu_bar">
        <select onChange = {onChangeSortType}>
            <option value={"latest"}>최신순</option>
            <option value={"oldest"}>오래된 순</option>
        </select>
        <Button onClick={()=>nav("/qnanew")}
        text={"새 문의 작성"} />
        </div>
        <div className="list_wrapper">
            {sortedData.map((item)=> <QnaItem key={item.id} {...item}/>)}
        </div>
    </div>
    );
}

export default QnaList;
