import "./QnaViewer.css";


const QnaViewer = ({sortType, emailType, emailType2, content})=>{
    return <div className="Viewer">
        <section className="info_section">
            <div>문의 분류: {sortType}</div>
            <div>답변 받으실 이메일: {emailType}@{emailType2}</div>
        </section>
        <section className="content_section">
            <div>[문의 사항]</div>
            <div className="content_wrapper">
                <p>{content}</p>
            </div>
        </section>
    </div>
}
export default QnaViewer;