import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [greet, setGreet] = useState("Greeter");
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState("");
  const [greetingValue, setGreetingValue] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const ABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "greet",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      name: "setGreeting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const contract = new ethers.Contract(contractAdress, ABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);
    };
    const getBalance = async () => {
      const balance = await provider.getBalance(contractAdress);
      const balanceFormatted = ethers.utils.formatEther(balance);
      setBalance(balanceFormatted);
    };
    const getGreeting = async () => {
      const greeting = await contract.greet();
      setGreet(greeting);
    };
    getGreeting().catch(console.error);
    getBalance().catch(console.error);
    connectWallet().catch(console.error);
  }, []);

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };
  const handleDepositeSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositEth = await contract.deposit({ value: ethValue });
    await depositEth.wait();
    const balance = await provider.getBalance(contractAdress);
    const balanceFormatted = ethers.utils.formatEther(balance);
    setBalance(balanceFormatted);
  };
  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    const greetingUpdate = await contract.setGreeting(greetingValue);
    await greetingUpdate.wait();
    setGreet(greetingValue);
    setGreetingValue("");
  };
  console.log(greet, "greet");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0px auto",
        maxWidth: "800px",
        width: "100%",
        padding: "20px",
        cursor: "pointer",
      }}
    >
      <div>
        <h1>{greet}</h1>
        <p>Contract balance:{balance} ETH</p>
      </div>
      <div>
        <form onSubmit={handleDepositeSubmit} style={{ margin: "0px 0px 20px 0px" }}>
          <input
            style={{ bordr: "1px solid black", width: "200px", height: "30px" }}
            type="number"
            onChange={handleDepositChange}
            value={depositValue}
          />
          <button
            style={{
              border: "none",
              color: "#fff",
              backgroundColor: "#00d286",
              width: "100px",
              height: "36px",
              marginLeft: "10px",
            }}
            type="submit"
          >
            Deposit
          </button>
        </form>
        <form onSubmit={handleGreetingSubmit}>
          <input
            style={{ bordr: "1px solid black", width: "200px", height: "30px" }}
            type="text"
            onChange={handleGreetingChange}
            value={greetingValue}
          />
          <button
            style={{
              border: "none",
              color: "#fff",
              backgroundColor: "orangered",
              width: "100px",
              height: "36px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Change
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
