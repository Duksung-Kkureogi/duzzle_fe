import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Storylist.css";

interface Story {
  storyId: number;
  title: string;
  totalPage: number;
  readPage: number;
}

const Storylist: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { state } = useLocation<{ zoneNameKr: string }>();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          `${RequestURL}/v1/story/progress/${zoneId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setStories(response.data.data.list);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [zoneId, RequestURL, token]);

  const handleStoryClick = (storyId: number, title: string) => {
    navigate(`/story/${storyId}`, { state: { zoneId, title } });
  };

  return (
    <div className="container_list">
      <h1 className="list_title">{state?.zoneNameKr} 스토리</h1>
      <ul className="ul_list">
        {stories.map((story) => (
          <li className="li_list" key={story.storyId}>
            <span className="story_title">{story.title}</span>
            <button
              className="button_r"
              onClick={() => handleStoryClick(story.storyId, story.title)}
            >
              읽기
            </button>
            <div className="progress-bar-r">
              <div
                className="progress-bar-inner-r"
                style={{
                  width: `${(story.readPage / story.totalPage) * 100}%`,
                }}
              ></div>
            </div>
            <span className="readPage">
              {story.readPage}/{story.totalPage}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Storylist;
