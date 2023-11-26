import Web3 from "web3";

let web3: Web3 | undefined;

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

const initWeb3 = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (
    typeof window !== "undefined" &&
    typeof window.web3 !== "undefined"
  ) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log("Non-Ethereum browser detected");
  }
};
initWeb3();

export default web3;
