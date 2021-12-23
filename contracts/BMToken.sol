//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "./token/behaviours/ERC20Mintable.sol";

contract BMToken is ERC20Burnable, ERC20Mintable, Ownable {
    constructor(string memory name, string memory symbol, uint256 initialBalance) ERC20(name, symbol) {
        require(initialBalance > 0, "BMToken: Supply cannot be zero");
        _mint(msg.sender, initialBalance * (10 ** 18));
    }

    function _mint(address account, uint256 amount) internal override onlyOwner {
        super._mint(account, amount);
    }
}