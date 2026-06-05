// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IQXToken} from "../src/IQXToken.sol";
import {CryptoQuizNFT} from "../src/CryptoQuizNFT.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        IQXToken token = new IQXToken();
        CryptoQuizNFT nft = new CryptoQuizNFT();

        vm.stopBroadcast();

        console.log("IQXToken:     ", address(token));
        console.log("CryptoQuizNFT:", address(nft));
    }
}
