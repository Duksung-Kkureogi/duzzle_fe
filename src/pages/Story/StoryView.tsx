import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./StoryView.css";
interface StoryContent {
  storyId: number;
  totalPage: number;
  content: string[];
}

const storyContents: { [key: number]: StoryContent } = {
  1: {
    storyId: 1,
    totalPage: 10,
    content: ["첫 번째 페이지", "두 번째 페이지", "세 번째 페이지"],
  },
  2: {
    storyId: 2,
    totalPage: 8,
    content: ["첫 페이지", "두 번째 페이지", "세 번째 페이지"],
  },
  3: {
    storyId: 3,
    totalPage: 12,
    content: ["페이지 1", "페이지 2", "페이지 3"],
  },
};

const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  const story = storyContents[parseInt(storyId)];

  const handleNextPage = () => {
    if (currentPage < story.totalPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container_v">
      <h1 className="title">책 내용</h1>
      <div className="content">
        <p>{story.content[currentPage]}</p>
      </div>
      <button
        className="button_next"
        onClick={handleNextPage}
        disabled={currentPage >= story.totalPage - 1}
      >
        다음 페이지
      </button>
      <div>
        <span className="current">
          {currentPage + 1}/{story.totalPage}
        </span>
      </div>
    </div>
  );
};

export default StoryView;
