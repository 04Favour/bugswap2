// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BugSwap {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;
    address public owner;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function swap(uint256 amountA) external {
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer failed");
        uint256 amountB = amountA; // Simple 1:1 swap for demonstration
        require(tokenB.transfer(msg.sender, amountB), "Transfer failed");
    }

    function setTokens(address _tokenA, address _tokenB) external onlyOwner {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
}
