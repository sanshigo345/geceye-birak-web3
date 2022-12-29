import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/GeceyeBirak.json";

const getEthereumObject = () => window.ethereum;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allMesajs, setAllMesajs] = useState([]);
  const contractAddress = "0x2fdccdb21469D0411A372275a559f7BD7752CA68";

  const contractABI = abi.abi;

  const [mesajValue, setMesajValue] = React.useState("")

  const getAllMesajs = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gbContract = new ethers.Contract(contractAddress, gb.abi, signer);

        const waves = await gbContract.getAllMesajs();

        let mesajsCleaned = [];
        mesajs.forEach(mesaj => {
          mesajsCleaned.push({
            address: mesaj.mesajer,
            timestamp: new Date(wave.timestamp * 1000),
            message: mesaj.message
          });
        });

        setAllMesajs(mesajsCleaned);

        gbContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllMesajs(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

   const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Önce MetaMask ile Bağlan!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const mesaj = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gbContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await gbContract.getTotalMesajs();
        console.log("Retrieved total mesaj count...", count.toNumber());
        
        const mesajTxn = await gbContract.mesaj("mesajValue, {gasLimit:300000}");
        console.log("Mining...", mesajTxn.hash);

        await mesajTxn.wait();
        console.log("Mined -- ", mesajTxn.hash);

        count = await gbContract.getTotalMesajs();
        console.log("Retrieved total mesaj count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllMesajs();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        🌙 Geceye Bırak!
        </div>

        <div className="bio">
        Sonsuza kadar saklanması için geceye bir mesaj bırak!
        </div>
         <div className="bio">
        Mesaj bırakan herkesin ETH kazanma şansı var!
        </div>
        <div className="bio">
           
        </div>
        
        {/*
         * If there is no currentAccount render this button
         */}
        {
          currentAccount ? (<textarea name="mesajArea"
            placeholder="mesajını yaz"
            type="text"
            id="mesaj"
            value={mesajValue}
            onChange={e => setMesajValue(e.target.value)} />) : null
        }
        <button className="GeceyeBirakButton" onClick={mesaj}>
          Geceye bırak!
        </button>
        {!currentAccount && (
          <button className="ConnectWalletButton" onClick={connectWallet}>
            Metamask ile Bağlan
          </button>
        )}
          {allMesajs.map((mesaj, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {mesaj.address}</div>
              <div>Time: {mesaj.timestamp.toString()}</div>
              <div>Message: {mesaj.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default App;
