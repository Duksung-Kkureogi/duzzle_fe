/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { ContractAddress, EventTopic } from "./src/constant/contract";
import { DalAbi } from "./src/constant/abi/dal-abi";
import { PlayDuzzleAbi } from "./src/constant/abi/playduzzle-abi";
import { BlueprintItemAbi } from "./src/constant/abi/blueprintItem-abi";
import { MaterialItemAbi } from "./src/constant/abi/MaterialItem-abi";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }

  async getDalBalance(): Promise<any> {
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      ContractAddress.Dal,
      JSON.parse(JSON.stringify(DalAbi)),
      signer
    );

    // Read message from smart contract
    const balance = await contract.balanceOf(signer.address);

    return ethers.formatEther(balance);
  }

  async getRandomItem(): Promise<any> {
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      ContractAddress.PlayDuzzle,
      JSON.parse(JSON.stringify(PlayDuzzleAbi)),
      signer
    );

    const tx = await contract.getRandomItem();
    const receipt = await tx.wait();
    const mintEvent = receipt?.logs.find(
      (e: any) => e.topics[0] === EventTopic.Mint
    );

    const tokenAddress = mintEvent?.address;
    const getMetadataUrl = async (tokenAddress: string) => {
      const abi =
        tokenAddress === ContractAddress.BlueprintItem
          ? BlueprintItemAbi
          : MaterialItemAbi;
      const iface = new ethers.Interface(BlueprintItemAbi);
      const decodedLog = iface.parseLog(mintEvent!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, no-unsafe-optional-chaining
      const [, tokenId] = decodedLog?.args!;
      const tokenContract = new ethers.Contract(
        tokenAddress,
        JSON.parse(JSON.stringify(abi)),
        signer
      );
      const metadataUrl = await tokenContract.tokenURI(tokenId);

      return metadataUrl;
    };
    const metadataUrl = await getMetadataUrl(tokenAddress);
    console.log("metadataUrl: ", metadataUrl);

    return metadataUrl;
  }
}
