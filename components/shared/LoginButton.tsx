"use client";
import React from "react";
import { getWeb3, initWeb3 } from "@/app/services/web3";

interface LoginButtonProps {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginButton: React.FC<LoginButtonProps> = ({ setAccount }) => {
  const handleLogin = React.useCallback(async () => {
    try {
      initWeb3();
      const web3 = getWeb3();
      if (web3) {
        await web3.eth.requestAccounts();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        console.log("REFUSED TO CONNECT");
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, [setAccount]);

  return (
    <button
      type="button"
      onClick={() => {
        handleLogin();
      }}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      Log in
    </button>
  );
};

export default LoginButton;
