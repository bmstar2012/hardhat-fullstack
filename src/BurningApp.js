import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Spinner} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {ethers} from 'ethers'

import Moralis from "moralis";
import ERC721 from './artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json'

const MORALIS_SERVER_URL = 'https://4aimswskjsmp.usemoralis.com:2053/server';
const MORALIS_APP_ID = 'J4IhDRZtAho11zkks26DsOwH61gYKIjc0PJajirH';

const zero_address = "0x000000000000000000000000000000000000dead";

// const nftTokenId = 3;

function BurningApp() {
    let [nfts, setNFT] = useState([]);
    let [txId, setTxId] = useState('');
    let [wallet, setWallet] = useState('');
    let [tokenAddress, setTokenAddress] = useState('');
    let [tokenId, setTokenId] = useState('');
    let [isProcessing, setIsProcessing] = useState(false);
    let [removedList, setRemovedList] = useState([]);
    useEffect(() => {
        Moralis.start({serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID});
    }, []);

    async function requestAccount() {
        await window.ethereum.request({method: 'eth_requestAccounts'});
    }

    // const burnItem = async (token_address, token_id) => {
    //     console.log("here--click");
    //     await burnNFT(token_address, token_id)
    // }
    function getTokenKey(tokenAddress, tokenId) {
        return `${tokenAddress}_${tokenId}`;
    }

    async function burnNFT(nftTokenAddress, nftTokenId) {
        if (typeof window.ethereum !== 'undefined') {
            setIsProcessing(true);
            setTokenAddress(nftTokenAddress)
            setTokenId(nftTokenId);
            const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(nftTokenAddress, ERC721.abi, signer)
            const transaction = await contract.transferFrom(account, zero_address, nftTokenId);
            await transaction.wait();

            console.log("transaction", transaction);
            setTxId(transaction.hash);
            setWallet(account);
            setIsProcessing(false);
            setRemovedList([...removedList, getTokenKey(nftTokenAddress, nftTokenId)]);
        }
    }

    async function getNFTList() {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
            console.log(account);
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner()
            const options = {address: account, chain: 'binance testnet'}; //'bsc'
            const userEthNFTs = await Moralis.Web3API.account.getNFTs(options);
            console.log("userEthNFTs", userEthNFTs);
            setNFT(userEthNFTs.result);
        }
    }

    let list = [];
    nfts.forEach((item) => {
        const {name, symbol, token_address, token_uri, token_id} = item;
        const tokenKey = getTokenKey(token_address, token_id);
        if (!removedList.includes(tokenKey)) {
            list.push(<div key={`${token_address}${token_id}`} className={"nft-data"}>
                name: {name}<br/>
                token_address: {token_address}<br/>
                token_id: {token_id}<br/>
                token_uri: {token_uri}<br/>
                <button onClick={async () => {
                    await burnNFT(token_address, token_id)}
                }>Burn</button>
            </div>);
        }
    })
    console.log("list", list);

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col>
                        <div className={"list"}>
                            {/*<button onClick={burnNFT}>Burn NFT</button>*/}
                            <button onClick={getNFTList}>Get NFT List</button>
                            {list && list.length > 0 && <ul>
                                {list}
                            </ul>}
                        </div>
                    </Col>
                    <Col>
                        <div className={"result"}>
                            {isProcessing && <Spinner animation="border" />}<br/>
                            <label>Result</label><br/>
                            Wallet: {wallet}<br/>
                            Token: {tokenAddress}<br/>
                            tokenId: {tokenId}<br/>
                            Tx: {txId}
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default BurningApp;