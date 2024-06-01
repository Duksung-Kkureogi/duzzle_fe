export class ContractAddress {
  static get Dal(): string {
    return "0x66EEc699AF7F9586A3cEF7F18abB3D4a3b279c71";
  }

  static get PlayDuzzle(): string {
    return "0x4d03c07248f3ee253bf0Fa426Eb453a1317659D6";
  }

  static get BlueprintItem(): string {
    return "0xa07b3f7F489013558F56b77a17a664421fefc5Df";
  }
}

export enum EventTopic {
  Mint = "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885",
  Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  Burn = "0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5",
  StartSeason = "0xcc42337061958f958a08d27f96d5a0a81074c25936db646bc1fb194fdb4ef30f",
  SetZoneData = "0x103f24af39c7e7c12ee21ffed71c10dc9dba631749ee10f3a1a08470f3ff91e7",
  GetRandomItem = "0x34009a12cdecbe310c9e38f088c4c86f14eff51a1981813090ff386ffa04960f",
}

export const ItemPrice = 2; // DAL
