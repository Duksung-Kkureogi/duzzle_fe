import React from "react";
import { useNavigate } from "react-router-dom";
import "./Story.css";

interface Book {
  storyId: number;
  zoneNameKr: string;
  zoneNameUs: string;
  totalPage: number;
  readPage: number;
  zoneId: number;
}

const books: Book[] = [
  {
    storyId: 1,
    zoneNameKr: "차미리사관",
    zoneNameUs: "chamirisa",
    totalPage: 10,
    readPage: 4,
    zoneId: 1,
  },
  {
    storyId: 2,
    zoneNameKr: "덕성여자대학교",
    zoneNameUs: "Duksung",
    totalPage: 12,
    readPage: 6,
    zoneId: 2,
  },
];

const Story: React.FC = () => {
  const navigate = useNavigate();

  const handleReadBook = (storyId: number) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="container">
      <h1 className="Story_title">Story</h1>
      <ul className="ul">
        {books.map((book) => (
          <li className="li" key={book.storyId}>
            <h2 className="h2">
              {book.zoneNameKr} / {book.zoneNameUs}
            </h2>
            <button
              className="button"
              onClick={() => handleReadBook(book.storyId)}
            >
              click
            </button>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${(book.readPage / book.totalPage) * 100}%` }}
              />
            </div>
            <p className="page-info">
              {book.readPage}/{book.totalPage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Story;
