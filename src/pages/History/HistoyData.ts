import {
  PuzzleHistoryResponse,
  Rankings,
  SeasonHistoryResponse,
} from "../../Data/DTOs/HistoryDTO";
import springImg from "./spring.jfif";
import summerImg from "./summer.jfif";
import christmasImg from "./christmas.jfif";

export const seasonHistoryData: SeasonHistoryResponse[] = [
  {
    id: 0,
    title: "덕성 봄",
    thumbnailUrl: springImg,
    totalPieces: 100,
    mintedPieces: 52,
  },
  {
    id: 1,
    title: "덕성 여름",
    thumbnailUrl: summerImg,
    totalPieces: 200,
    mintedPieces: 200,
  },
  {
    id: 2,
    title: "덕성 크리스마스",
    thumbnailUrl: christmasImg,
    totalPieces: 100,
    mintedPieces: 99,
  },
];

const historyPuzzleData: PuzzleHistoryResponse[] = [];

const historyRankingData: Rankings[] = [];
