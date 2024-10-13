import { Deal, NftExchangeOfferStatus } from "../../Data/DTOs/Deal";
import { Http } from "../Http";

export interface GetDealQueryParams {
  page: number;
  count: number;
  status?: NftExchangeOfferStatus;
  requestedNfts?: string;
  offeredNfts?: string;
  offerorUser?: string;
}

export const DealApis = {
  getNftExchangeOffers: async (params: GetDealQueryParams) => {
    try {
      const offers = await Http.get<{ list: Deal[]; total: number }>(
        "/v1/nft-exchange",
        params
      );

      return offers;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  getMyOffers: async (params: GetDealQueryParams) => {
    try {
      const offers = await Http.get<{ list: Deal[]; total: number }>(
        "/v1/nft-exchange/my",
        params
      );
      console.log(offers);

      return offers;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};
