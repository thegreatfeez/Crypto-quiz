*This is a submission for the [GitHub Finish-Up-A-Thon Challenge](https://dev.to/challenges/github-2026-05-21)*

## What I Built

**Crypto Quiz Quest** is a blockchain-powered trivia game where players test their crypto knowledge and earn real on-chain rewards — not points, not badges in a database, but actual ERC-20 tokens and fully on-chain SVG NFTs minted directly to their wallet.

The game has 90 questions across three difficulty levels: Easy (HTML, CSS, crypto basics), Normal (JavaScript, React, mid-level crypto), and Hard (Solidity, smart contracts, cryptography). Each correct answer mints **IQX tokens** to the player's wallet. Score 70% or above and you can also claim a tier-specific **NFT badge** — Bronze, Diamond, or Platinum — stored entirely on-chain as an SVG.

What makes it different: every NFT is dynamically generated on-chain. The token metadata and image live inside the smart contract itself as a base64-encoded SVG. No IPFS, no centralized image host — if the blockchain exists, the art exists.

🔗 **Live app**: https://crypto-quiz-lake.vercel.app/

**Contracts (Base Sepolia testnet)**
- IQXToken: `0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5`
- CryptoQuizNFT: `0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6`

## Demo

🔗 **Live**: https://crypto-quiz-lake.vercel.app/

**How to try it:**
1. Visit the app and connect your wallet (MetaMask or any WalletConnect wallet)
2. Make sure you're on **Base Sepolia** testnet — get free ETH from https://faucet.quicknode.com/base/sepolia
3. Pick a difficulty, complete 20 questions
4. On the result screen, click **Claim IQX** to mint your tokens and (if score ≥ 70%) **Claim NFT** to mint your badge
5. Your IQX balance and NFT badges appear live in the wallet status panel

**App screenshots:**

_Start screen — difficulty selection, live wallet status showing IQX balance and owned badges:_

![Start screen with wallet connected](https://crypto-quiz-lake.vercel.app/)

_Result screen — showing earned IQX, NFT claim button, and on-chain SVG preview after minting:_

The on-chain SVG looks different for each tier:
- 🥉 **Bronze** — copper coin on brown gradient
- 💎 **Diamond** — blue rhombus on dark blue gradient  
- 🏆 **Platinum** — silver star on dark grey gradient

Each badge also embeds your score and wallet address directly in the artwork.

## The Comeback Story

This project started as a **fake blockchain game**. It looked like Web3 but had zero on-chain functionality:

```javascript
// The original "wallet" — completely hardcoded
function generateWalletId() {
  return '0x' + Math.random().toString(16).substr(2, 40);
}
```

A random hex string, regenerated every page load. No real wallet. No real tokens. The "NFT badges" were PNG images served from a local folder. Clicking "Claim" did nothing on-chain.

**Here's what it became:**

| Before | After |
|--------|-------|
| Fake wallet ID (random hex) | Real wallet via AppKit + WalletConnect |
| Simulated NFT (PNG in `/NFT/` folder) | Fully on-chain SVG minted to your wallet |
| "Earn IQX" display text only | Real ERC-20 token minted to `msg.sender` |
| Backend-gated minting | Permissionless contracts — no private key stored anywhere |
| Vanilla JS, no build step | React + TypeScript + Vite |

The biggest decision was how to handle minting. My first instinct was to store the deployer private key in Vercel environment variables so a backend API could mint on behalf of any winner. That works, but it means trusting a server with a private key. Instead I refactored the contracts to be **fully permissionless** — anyone can call `mint()` directly, with the contract enforcing the on-chain guards (`score >= 14`, `hasClaimed` duplicate prevention, max 140 IQX per call). No backend. No private key. Just the user's own wallet signing their own transaction.

The smart contracts are also leaner than they started. The original design used OpenZeppelin `AccessControl` with a `MINTER_ROLE`. After the permissionless refactor, that entire access layer was removed:

```solidity
// Before — 18 lines, required MINTER_ROLE
contract IQXToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    constructor(address admin) ERC20("IQX Token", "IQX") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

// After — 10 lines, permissionless with guard
contract IQXToken is ERC20 {
    constructor() ERC20("IQX Token", "IQX") {}
    function mint(uint256 amount) external {
        require(amount > 0 && amount <= 140 * 10 ** 18, "Amount out of range");
        _mint(msg.sender, amount);
    }
}
```

On the frontend, going from vanilla JS to React + TypeScript + wagmi wasn't just a rewrite — it unlocked proper reactive wallet state. The `WalletStatus` component now reads the user's live IQX balance and NFT ownership from the chain on every render, using `useReadContract` hooks that auto-refresh. No manual polling, no stale state.

**12 Foundry tests, all passing.** The on-chain SVG tokenURI still generates correctly, the duplicate-claim guard still works, and the new score threshold check is tested with boundary cases.

## My Experience with GitHub Copilot

I used AI coding assistance throughout this project to move faster on the parts that were well-defined while staying in full control of the architecture decisions.

The most valuable use was with the **Solidity contract design** — getting Foundry test scaffolding right, writing clean OpenZeppelin inheritance patterns, and debugging the on-chain SVG generation (encoding nested base64 inside a JSON base64 is surprisingly easy to get wrong). Having an AI that could instantly surface the right OpenZeppelin interfaces and catch type mismatches before compilation saved significant iteration time.

On the frontend, the **wagmi v2 + AppKit integration** has a lot of moving parts — `WagmiAdapter`, `WagmiProvider`, `QueryClientProvider`, the `useWriteContract` / `useWaitForTransactionReceipt` flow for tracking externally-submitted transactions. AI assistance was useful for getting the boilerplate right the first time rather than reading through multiple docs pages.

The most important thing I learned: AI assistance is most useful when **you already know what you want to build**. The key architectural decisions — permissionless vs. role-gated minting, on-chain SVG vs. IPFS, removing the backend entirely — those were judgment calls that required understanding the trade-offs. Once I had a clear decision, AI could help execute it quickly and correctly.

The project went from a fake Web3 demo to a real deployed dApp on Base Sepolia with 12 passing contract tests, a live Vercel deployment, and fully on-chain NFT art. That's the finish-up.
