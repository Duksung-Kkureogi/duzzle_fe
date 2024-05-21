/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WEB3AUTH_NETWORK,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import Web3 from "web3";

import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";

// IMP START - Dashboard Registration
const clientId =
  "BPbO-LorL6VnxrYGqX9WrY23EIN1cEEz9qR1Ir4npgxR8Yik9WfXh8_ic8o7en7yN7usdzHNYb8fEQxokEUzI_E"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x13882", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc-amoy.polygon.technology",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Amoy",
  blockExplorerUrl: "https://www.oklink.com/amoy",
  ticker: "MATIC",
  tickerName: "MATIC",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

export const web3auth = new Web3Auth({
  uiConfig: {
    defaultLanguage: "ko",
    loginGridCol: 2,
    loginMethodsOrder: ["google", "kakao", "github"],
    primaryButton: "emailLogin",
  },
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});

web3auth.configureAdapter(new MetamaskAdapter());

const RequestUrl = import.meta.env.VITE_REQUEST_URL;

function Login() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal({
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
        });
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  function checkLoginType(loginType: string | undefined) {
    if (loginType === "EMAIL_PASSWORDLESS") return "EMAIL";
    else if (loginType === "SMS_PASSWORDLESS") return "SMS";
    else if (loginType == null) return "METAMASK";
    else return loginType;
  }

  async function postData() {
    try {
      const web3 = new Web3(provider as any);
      const walletAddress = (await web3.eth.getAccounts())[0];
      const token = await web3auth.authenticateUser();
      const loginType = checkLoginType(
        (await web3auth.getUserInfo()).typeOfLogin?.toUpperCase()
      );

      const response = await axios.post(
        RequestUrl + "/v1/auth",
        { loginType: loginType, walletAddress: walletAddress },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.idToken,
          },
        }
      );
      console.log("요청 성공", response.data);
      localStorage.setItem("accessToken", response.data["data"]["accessToken"]);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  }

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
        postData();
        navigate("/mypage");
      }
    } catch (error) {
      console.log("로그인 실패: ", error);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="Login">
      <h1 className="title">Duzzle Duzzle Duzzle</h1>
      <div className="media">
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="1.5"
          stroke="#F16D9A"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
          ></path>
        </svg>
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="1.5"
          stroke="#34A853"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
          ></path>
        </svg>
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="1.5"
          stroke="#F47735"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
          ></path>
        </svg>
      </div>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </div>
  );
}

export default Login;
