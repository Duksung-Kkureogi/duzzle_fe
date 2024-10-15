/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { ContractAddress, EventTopic } from "./src/constant/contract";
import { DalAbi } from "./src/constant/abi/dal-abi";
import { PlayDuzzleAbi } from "./src/constant/abi/playduzzle-abi";
import { BlueprintItemAbi } from "./src/constant/abi/blueprintItem-abi";
import { MaterialItemAbi } from "./src/constant/abi/MaterialItem-abi";
import { PuzzlePieceAbi } from "./src/constant/abi/puzzle-piece-abi";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getDuzzleTokenApproval(): Promise<boolean> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const address = await (await ethersProvider.getSigner()).getAddress();

      if (!address) {
        console.error("No address found for signer");
        return false;
      }

      const nftAddresses = [
        ContractAddress.PuzzlePiece,
        ContractAddress.BlueprintItem,
        ...ContractAddress.MaterialItems,
      ];

      try {
        for (const nftAddress of nftAddresses) {
          await this.setApprovalForAll(
            ethersProvider,
            address,
            nftAddress,
            true
          );
        }
      } catch (error) {
        console.error("Error in Promise.all:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error setting approval for all:", error);
      return false;
    }
  }

  private async setApprovalForAll(
    ethersProvider: ethers.BrowserProvider,
    userAddress: string,
    nftAddress: string,
    approved: boolean
  ) {
    try {
      const isApproved = await this.isApprovedForAll(nftAddress, userAddress);
      if (isApproved === approved) {
        console.log(
          `Approval for all already set to ${approved} for user ${nftAddress}`
        );
        return;
      }
    } catch (error) {
      console.error(`Approval 확인 실패 ${nftAddress}`, error);
    }

    try {
      const nftContract = new ethers.Contract(
        nftAddress,
        [
          "function setApprovalForAll(address operator, bool approved) external",
        ],
        ethersProvider
      );

      const data = nftContract.interface.encodeFunctionData(
        "setApprovalForAll",
        [ContractAddress.NFTSwap, approved]
      );

      // 가스 관련 데이터 가져오기
      const feeData = await ethersProvider.getFeeData();

      // maxPriorityFeePerGas와 maxFeePerGas 설정
      const maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers.parseUnits("1", "gwei");
      const maxFeePerGas =
        feeData.maxFeePerGas ||
        (feeData.gasPrice
          ? feeData.gasPrice * BigInt(2)
          : ethers.parseUnits("20", "gwei"));

      const transactionParameters = {
        to: nftAddress,
        from: userAddress,
        data: data,
        // nonce: nonce,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
      };

      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log(
        `Approval for all set to ${approved} successfully, transaction hash: ${txHash}`
      );
    } catch (error) {
      console.error(`Approval 설정 실패 ${nftAddress}`, error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.code) {
        console.error("Error code:", error.code);
      }
      if (error.data) {
        console.error("Error data:", error.data);
      }
    }
  }

  private async isApprovedForAll(
    nftAddress: string,
    ownerAddress: string
  ): Promise<boolean> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // NFT 컨트랙트의 ABI에서 isApprovedForAll 함수만 사용
      const nftContractABI = [
        "function isApprovedForAll(address owner, address operator) view returns (bool)",
      ];

      const nftContract = new ethers.Contract(
        nftAddress,
        nftContractABI,
        ethersProvider
      );

      return await nftContract.isApprovedForAll(
        ownerAddress,
        ContractAddress.NFTSwap
      );
    } catch (error) {
      console.error("Error checking approval status:", error);
      throw error;
    }
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

    return parseFloat(ethers.formatEther(balance));
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

  async unlockPuzzlePiece(pieceId: number) {
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      ContractAddress.PlayDuzzle,
      JSON.parse(JSON.stringify(PlayDuzzleAbi)),
      signer
    );

    const estimateGas = await contract.unlockPuzzlePiece.estimateGas(pieceId);

    const tx = await contract.unlockPuzzlePiece(pieceId, {
      gasLimit: estimateGas,
    });
    const receipt = await tx.wait();
    const mintEvent = receipt?.logs.find(
      (e: any) => e.topics[0] === EventTopic.Mint
    );

    const tokenAddress = mintEvent?.address;
    const getMetadataUrl = async (tokenAddress: string) => {
      const iface = new ethers.Interface(PuzzlePieceAbi);
      const decodedLog = iface.parseLog(mintEvent!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, no-unsafe-optional-chaining
      const [, tokenId] = decodedLog?.args!;
      const tokenContract = new ethers.Contract(
        tokenAddress,
        JSON.parse(JSON.stringify(PuzzlePieceAbi)),
        signer
      );
      const metadataUrl = await tokenContract.tokenURI(tokenId);

      return metadataUrl;
    };
    const metadataUrl = await getMetadataUrl(tokenAddress);

    return metadataUrl;
  }
}
