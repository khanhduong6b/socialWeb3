import Web3 from "web3";

let web3: Web3 | undefined;

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

const initWeb3 = async () => {
  if (!web3) {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      web3 = new Web3(window.ethereum);
    } else if (
      typeof window !== "undefined" &&
      typeof window.web3 !== "undefined"
    ) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser detected");
    }
  }
};

const getWeb3 = () => {
  if (!web3) {
    return null;
  }
  return web3;
};

export { initWeb3, getWeb3 };
