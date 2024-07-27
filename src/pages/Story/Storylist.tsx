import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Storylist.css";

interface Story {
  storyId: number;
  title: string;
  totalPage: number;
  readPage: number;
}

const stories: { [key: number]: Story[] } = {
  1: [
    { storyId: 1, title: "차미리사관 1권", totalPage: 10, readPage: 6 },
    { storyId: 2, title: "차미리사관 2권", totalPage: 8, readPage: 4 },
    { storyId: 3, title: "차미리사관 3권", totalPage: 12, readPage: 7 },
  ],
  2: [
    { storyId: 1, title: "덕성여자대학교 1권", totalPage: 10, readPage: 6 },
    { storyId: 2, title: "덕성여자대학교 2권", totalPage: 8, readPage: 4 },
    { storyId: 3, title: "덕성여자대학교 3권", totalPage: 12, readPage: 7 },
  ],
  3: [
    { storyId: 1, title: "대강의동 1권", totalPage: 10, readPage: 6 },
    { storyId: 2, title: "대강의동 2권", totalPage: 8, readPage: 4 },
    { storyId: 3, title: "대강의동 3권", totalPage: 12, readPage: 7 },
  ],
};

const Storylist: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const nav = useNavigate();
  const zoneStories = stories[parseInt(zoneId)] || [];

  const handleStoryClick = (storyId: number) => {
    nav(`/story/${storyId}`);
  };

  return (
    <div className="container">
      <h1 className="list_title">책 리스트</h1>
      <ul className="ul">
        {zoneStories.map((story) => (
          <li className="li" key={story.storyId}>
            <span>{story.title}</span>
            <button
              className="button_r"
              onClick={() => handleStoryClick(story.storyId)}
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
            <span>
              {story.readPage}/{story.totalPage}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Storylist;
