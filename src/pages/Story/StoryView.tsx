import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StoryView.css";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";

interface StoryContent {
  storyId: number;
  currentPage: number;
  totalPage: number;
  content: string;
}

const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryContent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");
  const zoneId = state?.zoneId as string;
  const title = state?.title as string;

  useEffect(() => {
    const fetchStoryContent = async (page: number) => {
      try {
        const response = await axios.get(`${RequestURL}/v1/story`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { storyId, page },
        });
        const storyData = response.data.data;
        setStory(storyData);
      } catch (error) {
        console.error("스토리 내용 로딩 오류:", error);
      }
    };

    fetchStoryContent(currentPage + 1);
  }, [storyId, RequestURL, token, currentPage]);

  const updateStoryProgress = async (storyId: number, readPage: number) => {
    try {
      const response = await axios.patch(
        `${RequestURL}/v1/story/progress`,
        { storyId, readPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("진행 상태 업데이트 오류:", error);
    }
  };

  const handleNextPage = async () => {
    if (story && currentPage < story.totalPage - 1) {
      const newPage = currentPage + 1;
      const result = await updateStoryProgress(story.storyId, newPage);

      if (result?.result) {
        setCurrentPage(newPage);
      }
    }
  };

  const handleFinish = async () => {
    if (story && zoneId) {
      const result = await updateStoryProgress(story.storyId, story.totalPage);
      if (result?.result) {
        navigate(`/zone/${zoneId}`);
      }
    }
  };

  if (!story) {
    return <div className="LO">스토리 불러오는 중...</div>;
  }

  return (
    <div className="c3">
      <MyHeader leftChild={<MyButton />} />
      <div className="container_view">
        <div className="content_view">
          <p className="content_title">{title}</p>
          <br />
          <p className="content">{story.content}</p>
        </div>
        {currentPage < story.totalPage - 1 && (
          <button className="button_next" onClick={handleNextPage}>
            다음 페이지
          </button>
        )}
        {currentPage >= story.totalPage - 1 && (
          <button className="button_finish" onClick={handleFinish}>
            끝내기
          </button>
        )}
        <div>
          <span className="current_view">
            {currentPage + 1}/{story.totalPage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
