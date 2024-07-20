import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./StoryView.css";

interface Page {
  page: number;
  content: string;
}

const pages: Page[] = [
  { page: 1, content: "덕성여자대학교 스토리 1페이지 내용" },
  { page: 2, content: "덕성여자대학교 스토리 2페이지 내용" },
  { page: 3, content: "덕성여자대학교 스토리 3페이지 내용" },
  { page: 4, content: "덕성여자대학교 스토리 4페이지 내용" },
  { page: 5, content: "덕성여자대학교 스토리 5페이지 내용" },
  { page: 6, content: "덕성여자대학교 스토리 6페이지 내용" },
];

const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [readPage, setReadPage] = useState(0);

  const currentContent = pages.find(
    (page) => page.page === currentPage
  )?.content;

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMarkAsRead = () => {
    if (currentPage > readPage) {
      setReadPage(currentPage);
    }
  };

  return (
    <div className="container">
      <h1 className="title">책 내용 (ID: {storyId})</h1>
      <p className="content">
        페이지 {currentPage}: {currentContent}
      </p>
      <button className="button_next" onClick={handleNextPage}>
        다음 페이지
      </button>
      <button className="button_next" onClick={handleMarkAsRead}>
        이 페이지 읽음
      </button>
      <p className="page-info">현재 읽은 페이지: {readPage}</p>
    </div>
  );
};

export default StoryView;
2;
