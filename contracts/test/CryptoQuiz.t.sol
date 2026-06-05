// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {IQXToken}     from "../src/IQXToken.sol";
import {CryptoQuizNFT} from "../src/CryptoQuizNFT.sol";

contract CryptoQuizTest is Test {
    IQXToken      token;
    CryptoQuizNFT nft;

    address admin    = address(1);
    address player   = address(2);
    address stranger = address(3);

    // Cache tier constants to avoid vm.prank being consumed by getter calls
    uint8 constant BRONZE   = 0;
    uint8 constant DIAMOND  = 1;
    uint8 constant PLATINUM = 2;

    function setUp() public {
        vm.startPrank(admin);
        token = new IQXToken(admin);
        nft   = new CryptoQuizNFT(admin);
        vm.stopPrank();
    }

    // ── IQXToken ──────────────────────────────────────────────────────────────

    function test_MintIQX() public {
        vm.prank(admin);
        token.mint(player, 60 ether);
        assertEq(token.balanceOf(player), 60 ether);
    }

    function test_MintIQX_RevertIfNotMinter() public {
        vm.expectRevert();
        vm.prank(stranger);
        token.mint(player, 10 ether);
    }

    // ── CryptoQuizNFT — minting ───────────────────────────────────────────────

    function test_MintBronze() public {
        vm.startPrank(admin);
        nft.mint(player, BRONZE, 18);
        vm.stopPrank();

        assertEq(nft.balanceOf(player), 1);
        assertTrue(nft.hasClaimed(player, BRONZE));
    }

    function test_MintAllTiers() public {
        vm.startPrank(admin);
        nft.mint(player, BRONZE,   15);
        nft.mint(player, DIAMOND,  17);
        nft.mint(player, PLATINUM, 20);
        vm.stopPrank();

        assertEq(nft.balanceOf(player), 3);
    }

    function test_MintNFT_RevertDuplicate() public {
        vm.startPrank(admin);
        nft.mint(player, BRONZE, 16);
        vm.expectRevert("Already claimed this tier");
        nft.mint(player, BRONZE, 18);
        vm.stopPrank();
    }

    function test_MintNFT_RevertIfNotMinter() public {
        vm.expectRevert();
        vm.prank(stranger);
        nft.mint(player, BRONZE, 18);
    }

    function test_MintNFT_RevertInvalidTier() public {
        vm.expectRevert("Invalid tier");
        vm.prank(admin);
        nft.mint(player, 99, 18);
    }

    function test_MintNFT_RevertInvalidScore() public {
        vm.expectRevert("Invalid score");
        vm.prank(admin);
        nft.mint(player, BRONZE, 21);
    }

    // ── CryptoQuizNFT — tokenURI (on-chain SVG) ───────────────────────────────

    function test_TokenURIContainsBase64() public {
        vm.startPrank(admin);
        nft.mint(player, BRONZE, 18);
        vm.stopPrank();

        string memory uri = nft.tokenURI(0);
        // must start with the data URI prefix for JSON
        assertTrue(_startsWith(uri, "data:application/json;base64,"));
    }

    function test_TokenURIChangesPerTier() public {
        vm.startPrank(admin);
        nft.mint(player,   BRONZE,   15);
        nft.mint(player,   DIAMOND,  17);
        vm.stopPrank();

        // Different tiers must produce different URIs
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
