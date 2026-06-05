// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CryptoQuizNFT is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint8 public constant BRONZE   = 0;
    uint8 public constant DIAMOND  = 1;
    uint8 public constant PLATINUM = 2;

    struct TokenData {
        uint8   tier;
        uint8   score;
        address player;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => TokenData)            private _tokenData;
    mapping(address => mapping(uint8 => bool)) public  hasClaimed;

    event NFTMinted(address indexed to, uint8 tier, uint8 score, uint256 tokenId);

    constructor(address admin) ERC721("CryptoQuiz Badge", "CQBADGE") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint8 tier, uint8 score) external onlyRole(MINTER_ROLE) {
        require(tier  <= PLATINUM, "Invalid tier");
        require(score <= 20,       "Invalid score");
        require(!hasClaimed[to][tier], "Already claimed this tier");

        uint256 tokenId = _nextTokenId++;
        hasClaimed[to][tier] = true;
        _tokenData[tokenId]  = TokenData(tier, score, to);
        _safeMint(to, tokenId);

        emit NFTMinted(to, tier, score, tokenId);
    }

    // ── Token URI (fully on-chain) ────────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        TokenData memory d = _tokenData[tokenId];

        string memory svg  = _buildSVG(d);
        string memory json = _buildJSON(tokenId, d, svg);
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    // ── SVG ───────────────────────────────────────────────────────────────────

    function _buildSVG(TokenData memory d) internal pure returns (string memory) {
        (
            string memory bg1,
            string memory bg2,
            string memory accent,
            string memory textLight,
            string memory textMid
        ) = _tierColors(d.tier);

        string memory header = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="350" height="350" viewBox="0 0 350 350">',
            '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="', bg1, '"/>',
            '<stop offset="100%" stop-color="', bg2, '"/>',
            '</linearGradient></defs>',
            '<rect width="350" height="350" fill="url(#bg)" rx="20"/>',
            '<rect width="346" height="346" x="2" y="2" fill="none" stroke="', accent, '" stroke-width="2" rx="19"/>',
            '<text x="175" y="32" text-anchor="middle" font-family="monospace" font-size="11" fill="', accent, '">CRYPTO QUIZ BADGE</text>'
        ));

        string memory body = string(abi.encodePacked(
            _tierIcon(d.tier, accent, bg1),
            '<text x="175" y="198" text-anchor="middle" font-family="monospace" font-size="22" font-weight="bold" fill="', accent, '">', _tierName(d.tier), '</text>',
            '<text x="175" y="238" text-anchor="middle" font-family="monospace" font-size="16" fill="', textLight, '">Score: ', uint256(d.score).toString(), ' / 20</text>',
            '<text x="175" y="272" text-anchor="middle" font-family="monospace" font-size="12" fill="', textMid, '">', _shortAddress(d.player), '</text>',
            '<text x="175" y="322" text-anchor="middle" font-family="monospace" font-size="10" fill="', textMid, '">IQX Quest</text>',
            '</svg>'
        ));

        return string(abi.encodePacked(header, body));
    }

    // All icons share the same bounding box: centered at (175, 112), radius 48.
    function _tierIcon(uint8 tier, string memory accent, string memory dark) internal pure returns (string memory) {
        if (tier == BRONZE) {
            // Copper coin
            return string(abi.encodePacked(
                '<circle cx="175" cy="112" r="48" fill="', accent, '"/>',
                '<circle cx="175" cy="112" r="39" fill="none" stroke="', dark, '" stroke-width="4"/>',
                '<text x="175" y="128" text-anchor="middle" font-family="serif" font-size="36" font-weight="bold" fill="', dark, '">B</text>'
            ));
        } else if (tier == DIAMOND) {
            // Rhombus gem with inner highlight
            return string(abi.encodePacked(
                '<polygon points="175,64 223,112 175,160 127,112" fill="', accent, '"/>',
                '<polygon points="175,82 208,112 175,142 142,112" fill="none" stroke="', dark, '" stroke-width="3" stroke-opacity="0.5"/>'
            ));
        } else {
            // Five-pointed star  (outer r=48, inner r=23, centre 175,112)
            return string(abi.encodePacked(
                '<polygon points="175,64 189,93 221,97 197,119 203,151 175,135 147,151 153,119 129,97 162,93" fill="', accent, '"/>',
                '<polygon points="175,77 185,100 209,100 190,114 198,140 175,125 152,140 160,114 141,100 165,100" fill="none" stroke="', dark, '" stroke-width="2" stroke-opacity="0.4"/>'
            ));
        }
    }

    // ── JSON Metadata ─────────────────────────────────────────────────────────

    function _buildJSON(uint256 tokenId, TokenData memory d, string memory svg) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"CryptoQuiz Badge #', tokenId.toString(),
            '","description":"Awarded for scoring ', uint256(d.score).toString(),
            '/20 on Crypto Quiz Quest.","image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '","attributes":[',
            '{"trait_type":"Tier","value":"',   _tierName(d.tier), '"},',
            '{"trait_type":"Score","value":',   uint256(d.score).toString(), '},',
            '{"trait_type":"Max Score","value":20}',
            ']}'
        ));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function _tierColors(uint8 tier) internal pure returns (
        string memory bg1,
        string memory bg2,
        string memory accent,
        string memory textLight,
        string memory textMid
    ) {
        if (tier == BRONZE) {
            return ("#3d1f0a", "#7c3a0a", "#CD7F32", "#f5deb3", "#a0856a");
        } else if (tier == DIAMOND) {
            return ("#061020", "#0d2240", "#00d4ff", "#cff5ff", "#5a9ab5");
        } else {
            return ("#141414", "#2a2a2a", "#e0e0e0", "#f5f5f5", "#909090");
        }
    }

    function _tierName(uint8 tier) internal pure returns (string memory) {
        if (tier == BRONZE)  return "BRONZE";
        if (tier == DIAMOND) return "DIAMOND";
        return "PLATINUM";
    }

    // "0x" + first 4 hex chars + "..." + last 4 hex chars  →  e.g. 0x1a2b...9f3c
    function _shortAddress(address addr) internal pure returns (string memory) {
        bytes memory full = bytes(Strings.toHexString(uint256(uint160(addr)), 20));
        // full is always exactly 42 bytes: '0','x', then 40 hex chars (indices 2-41)
        bytes memory out = new bytes(13);
        out[0] = full[0]; out[1] = full[1];                         // "0x"
        out[2] = full[2]; out[3] = full[3]; out[4] = full[4]; out[5] = full[5]; // first 4
        out[6] = '.'; out[7] = '.'; out[8] = '.';
        out[9]  = full[38]; out[10] = full[39]; out[11] = full[40]; out[12] = full[41]; // last 4
        return string(out);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, AccessControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
