import { IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import React, { createContext, useState, useContext, ReactNode } from "react";
import RPC from "../../ethersRPC";
import { LoginRequest } from "../Data/DTOs/UserDTO";
import { Web3AuthParameters } from "../constant/blockchain";
import { Http } from "./Http";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

interface DuzzleUser {
  accessToken: string;
  id: number;
  email: string;
  name: string;
  level: number;
  walletAddress: string;
  createdAt: Date;
}

interface AuthContextType {
  web3auth: Web3Auth | null;
  duzzleLoggedIn: boolean;
  web3LoggedIn: boolean;
  setDuzzleLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setWeb3LoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setWeb3auth: React.Dispatch<React.SetStateAction<Web3Auth | null>>;
  web3AuthInit: () => void;

  duzzleLogin: (params: LoginRequest) => void;
  user: DuzzleUser | null;
  logout: () => void;
  showDalBalance: () => void;
  getDal: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [duzzleLoggedIn, setDuzzleLoggedIn] = useState(false);
  const [web3LoggedIn, setWeb3LoggedIn] = useState(false);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [user, setUser] = useState<DuzzleUser | null>(null);

  const { clientId, chainConfig, openLoginAdapterOptions, modalConfig } =
    Web3AuthParameters;
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3AuthOptions: Web3AuthOptions = {
    uiConfig: {
      defaultLanguage: "ko",
      loginGridCol: 2,
      loginMethodsOrder: ["google", "kakao", "github"],
      primaryButton: "emailLogin",
    },
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
    sessionTime: 86400, // 1 day
  };

  const web3AuthInit = async () => {
    try {
      const web3auth = new Web3Auth(web3AuthOptions);
      const openloginAdapter = new OpenloginAdapter(openLoginAdapterOptions);
      web3auth.configureAdapter(openloginAdapter);
      web3auth.configureAdapter(new MetamaskAdapter());
      setWeb3auth(web3auth);

      await web3auth.initModal({
        modalConfig,
      });
      if (web3auth.connected) {
        setWeb3LoggedIn(true);
        localStorage.setItem("web3LoggedIn", "true");
        const rpc = new RPC(web3auth!.provider as IProvider);
        const [openLoginUserInfo, web3AuthInfo, walletAddress] =
          await Promise.all([
            web3auth?.getUserInfo(),
            web3auth?.authenticateUser(),
            rpc.getAccounts(),
          ]);

        await duzzleLogin({
          idToken: web3AuthInfo.idToken,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          loginType: openLoginUserInfo.typeOfLogin?.toUpperCase()!,
          walletAddress,
        });
        console.log("web3auth initialized");
      }
    } catch (error) {
      console.error(error);
    }
  };

  function checkLoginType(loginType: string | undefined) {
    if (loginType === "EMAIL_PASSWORDLESS") return "EMAIL";
    else if (loginType === "SMS_PASSWORDLESS") return "SMS";
    else if (loginType == null) return "METAMASK";
    else return loginType;
  }

  const duzzleLogin = async (params: LoginRequest) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = (
        await Http.post(
          "/v1/auth",
          {
            loginType: checkLoginType(params.loginType),
            walletAddress: params.walletAddress,
          },
          {
            headers: {
              Authorization: params.idToken,
            },
          }
        )
      ).data;
      localStorage.setItem("accessToken", response.data["accessToken"]);
      const user: DuzzleUser = {
        ...response.data,
        ...response.data.user,
      };
      setDuzzleLoggedIn(true);
      localStorage.setItem("duzzleLoggedIn", "true");
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    if (web3auth.connected) {
      await web3auth.logout();
    }
    localStorage.clear();
    setDuzzleLoggedIn(false);
    setWeb3LoggedIn(false);
  };

  const showDalBalance = async () => {
    if (!web3auth?.provider) {
      console.log("provider not initialized yet");
    } else {
      const rpc = new RPC(web3auth.provider as IProvider);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const balance = await rpc.getDalBalance();
      //UiConsole(balance);
    }
  };

  const getDal = async () => {
    if (!web3auth?.provider) {
      console.log("provider not initialized yet");
    } else {
      try {
        const rpc = new RPC(web3auth.provider as IProvider);
        const balance = await rpc.getDalBalance();
        return balance;
      } catch (error) {
        console.error("DAL 잔액을 가져오는 데 실패했습니다.", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        duzzleLoggedIn,
        setDuzzleLoggedIn,
        web3LoggedIn,
        setWeb3LoggedIn,
        duzzleLogin,
        logout,
        web3auth,
        setWeb3auth,
        web3AuthInit,
        user,
        showDalBalance,
        getDal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
