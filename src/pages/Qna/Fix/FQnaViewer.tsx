import "./FQnaViewer.css";

const FQnaViewer = ({ sortType, email, content }) => {
  return (
    <div className="Viewer">
      <div className="info">🌙 문의자 정보</div>
      <section className="info_section">
        <div>문의 종류 🧩 {sortType}</div>
        <div>이메일 💌 {email}</div>
      </section>
      <section className="content_section">
        <div className="content_title">
          <div>🌙 문의 사항</div>
        </div>

        <div className="content_wrapper">
          <p>{content}</p>
        </div>
      </section>
    </div>
  );
};
export default FQnaViewer;
