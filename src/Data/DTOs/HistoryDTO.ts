import { PieceDto } from "./PieceDto";

export type SeasonHistoryResponse = {
  id: number;
  title: string;
  thumbnailUrl: string;
  totalPieces: number;
  mintedPieces: number;
};

export type PuzzleHistoryResponse = {
  total: number;
  minted: number;
  pieces: PieceDto[];
};

export type Rankings = {
  rank: number;
  name: string;
  walletAddress: string;
  nftHoldings: number;
  nftHoldingsPrecentage: number;
};
