import MyButton from "../../components/MyButton";
import MyHeader from "../../components/MyHeader";
import { useParams } from "react-router-dom";
import QnaViewer from "./QnaViewer";
import QnaUse from "./QnaUse";

const QnaDiary= ()=> {
    const params = useParams();
    const curDiaryItem = QnaUse(params.id);
    if (!curDiaryItem){
        return <div>데이터 로딩중 @@</div>
    }

    const {sortType, emailType, emailType2, content} = curDiaryItem


    return(
    <div className="QnaDiary">
        <MyHeader headerText="내 문의" leftChild={<MyButton />} />
        {/* <div>
            {params.id}번 문의
        </div> */}
        <QnaViewer sortType={sortType} emailType={emailType} emailType2={emailType2} content={content}/>
    </div>
    );
}

export default QnaDiary;