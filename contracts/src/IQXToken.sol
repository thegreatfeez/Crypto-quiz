// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Hard mode: 20 questions × 7 IQX = 140 IQX maximum per quiz session
uint256 constant MAX_MINT = 140 * 10 ** 18;

contract IQXToken is ERC20 {
    constructor() ERC20("IQX Token", "IQX") {}

    function mint(uint256 amount) external {
        require(amount > 0 && amount <= MAX_MINT, "Amount out of range");
        _mint(msg.sender, amount);
    }
}
