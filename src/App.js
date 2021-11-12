import './App.scss';
import React from "react";
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

export default class App extends React {
  render() {
    return <div>Hello word</div>
  }
}