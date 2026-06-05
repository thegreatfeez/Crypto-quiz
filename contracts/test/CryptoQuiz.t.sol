// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {IQXToken}      from "../src/IQXToken.sol";
import {CryptoQuizNFT} from "../src/CryptoQuizNFT.sol";

contract CryptoQuizTest is Test {
    IQXToken      token;
    CryptoQuizNFT nft;

    address player  = address(2);
    address player2 = address(3);

    uint8 constant BRONZE   = 0;
    uint8 constant DIAMOND  = 1;
    uint8 constant PLATINUM = 2;

    function setUp() public {
        token = new IQXToken();
        nft   = new CryptoQuizNFT();
    }

    // ── IQXToken ──────────────────────────────────────────────────────────────

    function test_MintIQX() public {
        vm.prank(player);
        token.mint(60 ether);
        assertEq(token.balanceOf(player), 60 ether);
    }

    function test_MintIQX_MintsToSender() public {
        vm.prank(player);
        token.mint(7 ether);
        assertEq(token.balanceOf(player),  7 ether);
        assertEq(token.balanceOf(player2), 0);
    }

    function test_MintIQX_RevertExceedsMax() public {
        vm.expectRevert("Amount out of range");
        vm.prank(player);
        token.mint(141 ether);
    }

    function test_MintIQX_RevertZeroAmount() public {
        vm.expectRevert("Amount out of range");
        vm.prank(player);
        token.mint(0);
    }

    // ── CryptoQuizNFT — minting ───────────────────────────────────────────────

    function test_MintBronze() public {
        vm.prank(player);
        nft.mint(BRONZE, 18);

        assertEq(nft.balanceOf(player), 1);
        assertTrue(nft.hasClaimed(player, BRONZE));
    }

    function test_MintAllTiers() public {
        vm.startPrank(player);
        nft.mint(BRONZE,   15);
        nft.mint(DIAMOND,  17);
        nft.mint(PLATINUM, 20);
        vm.stopPrank();

        assertEq(nft.balanceOf(player), 3);
    }

    function test_MintNFT_RevertDuplicate() public {
        vm.startPrank(player);
        nft.mint(BRONZE, 16);
        vm.expectRevert("Already claimed this tier");
        nft.mint(BRONZE, 18);
        vm.stopPrank();
    }

    function test_MintNFT_RevertScoreTooLow() public {
        vm.expectRevert("Score below threshold");
        vm.prank(player);
        nft.mint(BRONZE, 13);
    }

    function test_MintNFT_RevertInvalidTier() public {
        vm.expectRevert("Invalid tier");
        vm.prank(player);
        nft.mint(99, 18);
    }

    function test_MintNFT_RevertInvalidScore() public {
        vm.expectRevert("Invalid score");
        vm.prank(player);
        nft.mint(BRONZE, 21);
    }

    // ── CryptoQuizNFT — tokenURI (on-chain SVG) ───────────────────────────────

    function test_TokenURIContainsBase64() public {
        vm.prank(player);
        nft.mint(BRONZE, 18);

        string memory uri = nft.tokenURI(0);
        assertTrue(_startsWith(uri, "data:application/json;base64,"));
    }

    function test_TokenURIChangesPerTier() public {
        vm.prank(player);
        nft.mint(BRONZE, 15);
        vm.prank(player2);
        nft.mint(DIAMOND, 17);

        assertTrue(
            keccak256(bytes(nft.tokenURI(0))) != keccak256(bytes(nft.tokenURI(1)))
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function _startsWith(string memory str, string memory prefix) internal pure returns (bool) {
        bytes memory s = bytes(str);
        bytes memory p = bytes(prefix);
        if (s.length < p.length) return false;
        for (uint256 i = 0; i < p.length; i++) {
            if (s[i] != p[i]) return false;
        }
        return true;
    }
}
