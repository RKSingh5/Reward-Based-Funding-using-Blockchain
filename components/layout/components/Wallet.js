import styled from "styled-components";
import { ethers } from "ethers";
import { useState } from "react";


const networks = {
  // polygon: {
  //   chainId: 0x${Number(80001).toString(16)},
  //   chainName: "Polygon Testnet",
  //   nativeCurrency: {
  //     name: "MATIC",
  //     symbol: "MATIC",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  //   blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  // },
  sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia Test Network",
    rpcUrls: ["https://rpc.sepolia.org/"],
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
};


const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");



  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      
      // Check if the chain with the same chainId already exists
      const existingChain = provider.network ? provider.network.chainId : null;
      if (existingChain !== "sepolia") {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks["sepolia"],
            },
          ],
        });
      } 
      
      const account = provider.getSigner();
      const Address = await account.getAddress();
      setAddress(Address);
      const Balance = ethers.utils.formatEther(await account.getBalance());
      setBalance(Balance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === -32602 && error.message.includes("nativeCurrency.symbol does not match currency symbol")) {
        // Handle the conflict error here, e.g., show a message to the user
        alert("There's a conflict with adding the network. Please check your MetaMask settings.");
      } else {
        // Handle other errors
        alert("An error occurred while connecting the wallet. Please try again later.");
      }
    }
  };
  

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance == '' ? <Balance></Balance> : <Balance>{balance.slice(0,4)} Sepolia</Balance> }
      {address == '' ? <Address>Connect Wallet</Address> : <Address>{address.slice(0,6)}...{address.slice(39)}</Address>}
    </ConnectWalletWrapper>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: 'Roboto';
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
    background-color: ${(props) => props.theme.bgSubDiv};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 5px;
    border-radius: 10px;
`

const Balance = styled.h2`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
`

export default Wallet;