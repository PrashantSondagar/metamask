import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const initialData = {
        address: localStorage.getItem("walletAddress") || "",
        balance: localStorage.getItem("walletBalance") || null,
    };

    const [data, setData] = useState(initialData);
    const [sendData, setSendData] = useState({
        toAddress: "",
        amount: "",
    });

    const btnHandler = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => accountChangeHandler(res[0]));
        } else {
            alert("Please install MetaMask extension!");
        }
    };

    const getBalance = (address) => {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
        provider.getBalance(address).then((balance) => {
            const formattedBalance = ethers.utils.formatEther(balance);
            setData({
                ...data,
                balance: formattedBalance,
            });
            localStorage.setItem("walletBalance", formattedBalance);
        });
    };

    const accountChangeHandler = (account) => {
        setData({
            address: account,
            balance: null,
        });
        localStorage.setItem("walletAddress", account);

        getBalance(account);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSendData({
            ...sendData,
            [name]: value,
        });
    };

    const handleSend = async () => {
        if (!sendData.toAddress || !sendData.amount) {
            alert("Please enter recipient address and amount.");
            return;
        }

        try {
            const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
            const signer = provider.getSigner();
            const tx = await signer.sendTransaction({
                to: sendData.toAddress,
                value: ethers.utils.parseEther(sendData.amount),
            });
            await tx.wait();
            alert("tBNB sent successfully on BNB Chain Testnet!");
        } catch (error) {
            alert("Failed to send tBNB on BNB Chain Testnet. Please try again.");
        }
    };

    useEffect(() => {
        if (data.address) {
            getBalance(data.address);
        }
    }, []);

    return (
        <div className="App">
            <Card className="text-center">
                <Card.Header>
                    <strong>Address: </strong>
                    {data.address}
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <strong>Balance: </strong>
                        {data.balance !== null ? `${data.balance} tBNB` : "Loading..."}
                    </Card.Text>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter recipient address"
                            name="toAddress"
                            value={sendData.toAddress}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter tBNB amount"
                            name="amount"
                            value={sendData.amount}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button onClick={handleSend} variant="primary">
                        Send
                    </Button>
                    <Button onClick={btnHandler} variant="secondary">
                        Connect to wallet
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default App;
