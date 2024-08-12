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

export const historyPuzzleData: PuzzleHistoryResponse = {
  total: 4,
  minted: 2,
  pieces: [
    {
      zoneNameKr: "정문・대학본부",
      pieceId: 0,
      coordinates:
        "25.86,60.26,25.86,56.97,27.71,55.97,36.29,60.12,38.29,58.97,42.14,60.83,42,64.83,38.29,66.54",
      minted: false,
      data: {
        requiredItems: [
          {
            name: "붉은벽돌",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
            count: 3,
          },
          {
            name: "모래",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/sand-item.png",
            count: 3,
          },
          {
            name: "망치",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/hammer-item.png",
            count: 3,
          },
          {
            name: "설계도면(정문・대학본부)",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/blueprint-item.png",
            count: 1,
          },
        ],
      },
    },
    {
      zoneNameKr: "스머프동산",
      pieceId: 1,
      coordinates: "17.43,55.62,20.8,53.33,26.83,56.48,23.87,59.19",
      minted: true,
      data: {
        season: "Duksung Christmas 20 Pieces",
        owner: {
          name: "bb",
          walletAddress: "0x990F87645027a2Fd02fB7Db05ec8a46BB6025384",
        },
        nftThumbnailUrl:
          "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/pp9.png",
      },
    },
    {
      zoneNameKr: "인문사회관",
      pieceId: 2,
      coordinates:
        "16.71,55.63,21,53.78,21,50.78,16.29,48.2,16.43,46.35,14.43,45.06,10.57,47.63,10.86,52.78,12.71,53.63,14.71,52.63",
      minted: false,
      data: {
        requiredItems: [
          {
            name: "붉은벽돌",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/redbrick-item.png",
            count: 5,
          },
          {
            name: "망치",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/hammer-item.png",
            count: 5,
          },
          {
            name: "설계도면(인문사회관)",
            image:
              "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/blueprint-item.png",
            count: 1,
          },
        ],
      },
    },
    {
      zoneNameKr: "국제기숙사",
      pieceId: 19,
      coordinates:
        "80.69,20.71,77.06,22.71,77.06,26.14,81.06,28.14,84.77,26.29,84.77,22.71",
      minted: true,
      data: {
        season: "Duksung Christmas 20 Pieces",
        owner: {
          name: "하하",
          walletAddress: "0xeB4774d30E9798aE17142069527ec0855d33C4Cf",
        },
        nftThumbnailUrl:
          "https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/metadata/pp9.png",
      },
    },
  ],
};

const historyRankingData: Rankings[] = [];
