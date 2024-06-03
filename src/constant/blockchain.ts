import {
  CHAIN_NAMESPACES,
  CustomChainConfig,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { ModalConfig } from "@web3auth/modal";
import { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";

export const Web3AuthParameters: {
  clientId: string;
  chainConfig: CustomChainConfig;
  web3AuthNetwork: string;
  openLoginAdapterOptions: OpenloginAdapterOptions;
  modalConfig: Record<string, ModalConfig>;
} = {
  clientId:
    "BPbO-LorL6VnxrYGqX9WrY23EIN1cEEz9qR1Ir4npgxR8Yik9WfXh8_ic8o7en7yN7usdzHNYb8fEQxokEUzI_E", // get from https://dashboard.web3auth.io

  chainConfig: {
    chainId: "0x13882", // Please use 0x1 for Mainnet
    rpcTarget: "https://rpc-amoy.polygon.technology",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: "Amoy",
    blockExplorerUrl: "https://www.oklink.com/amoy",
    ticker: "MATIC",
    tickerName: "MATIC",
  },
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  openLoginAdapterOptions: {
    loginSettings: {
      mfaLevel: "optional",
    },
    adapterSettings: {
      uxMode: "redirect", // "redirect" | "popup"
      mfaSettings: {
        deviceShareFactor: {
          enable: true,
          priority: 1,
          mandatory: true,
        },
        backUpShareFactor: {
          enable: true,
          priority: 2,
          mandatory: true,
        },
        socialBackupFactor: {
          enable: true,
          priority: 3,
          mandatory: false,
        },
        passwordFactor: {
          enable: true,
          priority: 4,
          mandatory: false,
        },
      },
    },
  },
  modalConfig: {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: "openlogin",
      loginMethods: {
        github: {
          name: "github",
          showOnModal: false,
        },
        reddit: {
          name: "reddit",
          showOnModal: false,
        },
        discord: {
          name: "discord",
          showOnModal: false,
        },
        twitch: {
          name: "twitch",
          showOnModal: false,
        },
        line: {
          name: "line",
          showOnModal: false,
        },
        linkedin: {
          name: "linkedin",
          showOnModal: false,
        },
        weibo: {
          name: "weibo",
          showOnModal: false,
        },
        wechat: {
          name: "wechat",
          showOnModal: false,
        },
        farcaster: {
          name: "farcaster",
          showOnModal: false,
        },
      },
    },
  },
};
