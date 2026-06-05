// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IQXToken} from "../src/IQXToken.sol";
import {CryptoQuizNFT} from "../src/CryptoQuizNFT.sol";

contract Deploy is Script {
    function run() external {
        address deployer = msg.sender;

        vm.startBroadcast();

        IQXToken token = new IQXToken(deployer);
        CryptoQuizNFT nft = new CryptoQuizNFT(deployer);

        vm.stopBroadcast();

        console.log("IQXToken:     ", address(token));
        console.log("CryptoQuizNFT:", address(nft));
        console.log("Deployer:     ", deployer);
    }
}
