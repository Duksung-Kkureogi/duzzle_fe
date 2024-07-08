import { PieceDto } from "./PieceDto";
import buildingImg from "../../assets/images/building.png";
import blueprintImg from "../../assets/images/blueprint.png";
import brickImg from "../../assets/images/brick.png";
import hammerImg from "../../assets/images/hammer.png";

export const pieces: PieceDto[] = [
  {
    zoneName: "도서관",
    pieceId: 1,
    points: { x: 250, y: 400 },
    minted: true,
    data: {
      season: "summer",
      owner: {
        name: "HYOWON",
        walletAddress: "0x990F87645027a2Fd02fB7Db05ec8a46BB6025384",
      },
      nftThumbnailUrl: buildingImg,
    },
  },
  {
    zoneName: "차미리사기념관",
    pieceId: 2,
    points: { x: 250, y: 330 },
    minted: false,
    data: {
      requiredItems: [
        {
          name: "설계도면(차미리사기념관)",
          image: blueprintImg,
          count: 1,
        },
        {
          name: "붉은 벽돌",
          image: brickImg,
          count: 2,
        },
        {
          name: "망치",
          image: hammerImg,
          count: 3,
        },
      ],
    },
  },
];
