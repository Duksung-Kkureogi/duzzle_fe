export type PieceDto = {
  zoneName: string;
  pieceId: number;
  points: { x: number; y: number };
  minted: boolean;
  data: Minted | Unminted;
};

export type Minted = {
  season: string;
  owner: { name: string; walletAddress: string };
  nftThumbnailUrl: string;
};

export type Unminted = {
  requiredItems: RequiredItem[];
};

export type RequiredItem = {
  name: string;
  image: string;
  count: number;
};
