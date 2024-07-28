import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./StoryView.css";

interface StoryContent {
  storyId: number;
  currentPage: number;
  totalPage: number;
  content: {
    id: number;
    content: string;
    speaker: string;
    image?: string;
  }[];
}

const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<StoryContent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchStoryContent = async () => {
      try {
        const response = await axios.get(`${RequestURL}/v1/story`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { storyId },
        });
        const storyData = response.data.data;
        setStory(storyData);
        setCurrentPage(storyData.currentPage - 1);
      } catch (error) {
        console.error("세부 스토리 오류:", error);
      }
    };

    fetchStoryContent();
  }, [storyId, RequestURL, token]);

  const handleNextPage = () => {
    if (story && currentPage < story.content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!story) {
    return <div>로딩 중...</div>;
  }

  const { content, speaker, image } = story.content[currentPage];

  return (
    <div className="container_view">
      <h1 className="view_title">책 내용</h1>
      <div className="content_view">
        <p>{content}</p>
        {image && <img src={image} alt="스토리 이미지" />}
      </div>
      <button
        className="button_next"
        onClick={handleNextPage}
        disabled={currentPage >= story.content.length - 1}
      >
        다음 페이지
      </button>
      <div>
        <span className="current_view">
          {currentPage + 1}/{story.content.length}
        </span>
      </div>
    </div>
  );
};

export default StoryView;
