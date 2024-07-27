import React from "react";
import { useNavigate } from "react-router-dom";
import "./Story.css";

interface Zone {
  zoneId: number;
  zoneNameKr: string;
  zoneNameUs: string;
  totalStory: number;
  readStory: number;
}

const zones: Zone[] = [
  {
    zoneId: 1,
    zoneNameKr: "차미리사관",
    zoneNameUs: "Chamirisa",
    totalStory: 10,
    readStory: 4,
  },
  {
    zoneId: 2,
    zoneNameKr: "덕성여자대학교",
    zoneNameUs: "Duksung's uni",
    totalStory: 8,
    readStory: 2,
  },
  {
    zoneId: 3,
    zoneNameKr: "대강의동",
    zoneNameUs: "lecture",
    totalStory: 10,
    readStory: 6,
  },
  {
    zoneId: 4,
    zoneNameKr: "인사대",
    zoneNameUs: "language&literature",
    totalStory: 5,
    readStory: 3,
  },
  {
    zoneId: 5,
    zoneNameKr: "자연관",
    zoneNameUs: "science",
    totalStory: 12,
    readStory: 8,
  },
  {
    zoneId: 6,
    zoneNameKr: "종로운현캠퍼스",
    zoneNameUs: "history",
    totalStory: 7,
    readStory: 4,
  },
];

const Story: React.FC = () => {
  const navigate = useNavigate();

  const handleZoneClick = (zoneId: number) => {
    navigate(`/zone/${zoneId}`);
  };

  return (
    <div className="container">
      <h1 className="Story_title">Duzzle 스토리</h1>
      <img className="img" src="/src/pages/Story/story.jpg" />
      <ul className="ul">
        {zones.map((zone) => (
          <li className="li" key={zone.zoneId}>
            <span>
              {zone.zoneNameKr} ({zone.zoneNameUs})
            </span>
            <button
              className="button_b"
              onClick={() => handleZoneClick(zone.zoneId)}
            >
              선택
            </button>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{
                  width: `${(zone.readStory / zone.totalStory) * 100}%`,
                }}
              ></div>
            </div>
            <span>
              {zone.readStory}/{zone.totalStory}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Story;
