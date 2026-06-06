# 🧠 Crypto Quiz Quest

I built this crypto quiz app while learning frontend development — fake wallet, fake NFTs, fake everything. After learning Solidity, I came back and integrated real smart contracts. It now mints actual **$IQX tokens** and fully **on-chain SVG NFT badges** directly to your wallet.

🔗 **Live app**: https://crypto-quiz-lake.vercel.app/

---

## How It Works

20 questions per session across 3 difficulty levels:

| Difficulty | Topic | IQX per Correct | NFT Badge |
|------------|-------|-----------------|-----------|
| 🟢 Easy    | HTML, CSS, Crypto Basics | 1 IQX | 🥉 Bronze |
| 🟡 Normal  | JavaScript, React, Mid-Level Crypto | 3 IQX | 💎 Diamond |
| 🔴 Hard    | Solidity, Smart Contracts, Cryptography | 7 IQX | 🏆 Platinum |

- Score **≥ 70%** (14/20) to qualify for an NFT badge
- All IQX and NFTs mint directly to `msg.sender` — permissionless, no approval needed
- NFT art is stored **fully on-chain** as an SVG — no IPFS, no external URLs

---

## What Changed

| Before | After |
|--------|-------|
| `Math.random()` fake wallet ID | Real wallet via AppKit + WalletConnect |
| PNG badges in a local folder | Fully on-chain SVG minted to your wallet |
| "Earn IQX" display text only | Real ERC-20 token minted to `msg.sender` |
| Vanilla JS, no build step | React + TypeScript + Vite |

---

## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- [AppKit v1](https://docs.reown.com/appkit/overview) — WalletConnect-based wallet UI
- [wagmi v2](https://wagmi.sh/) — React hooks for contract reads/writes
- [viem v2](https://viem.sh/) — EVM utilities
- Tailwind CSS (CDN) + Font Awesome

**Contracts**
- Solidity ^0.8.20 + OpenZeppelin
- Foundry (build, test, deploy)
- Deployed on **Base Sepolia** (testnet)

---

## Contracts

| Contract | Address (Base Sepolia) |
|----------|----------------------|
| IQXToken (ERC-20) | [`0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5`](https://sepolia.basescan.org/address/0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5) |
| CryptoQuizNFT (ERC-721) | [`0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6`](https://sepolia.basescan.org/address/0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6) |

**IQXToken** — `mint(uint256 amount)` — permissionless, mints to caller, max 140 IQX per call.

**CryptoQuizNFT** — `mint(uint8 tier, uint8 score)` — requires `score >= 14`, blocks duplicate claims per tier, mints on-chain SVG to caller.

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

You'll need a wallet on **Base Sepolia** with testnet ETH:
- Faucet: https://faucet.quicknode.com/base/sepolia

---

## Running Contract Tests

```bash
cd contracts
forge test
```

12 tests — mint guards, duplicate-claim prevention, score threshold, on-chain SVG tokenURI.

---

## Repo Structure

```
Crypto-quiz/
├── frontend/               ← Vite app (Vercel root)
│   ├── src/
│   │   ├── components/     ← StartScreen, QuizScreen, ResultScreen, WalletStatus
│   │   ├── contracts/      ← ABI definitions + deployed addresses
│   │   ├── config/         ← wagmi + AppKit setup
│   │   └── data/           ← 90 quiz questions (30 per difficulty)
│   ├── index.html
│   └── vercel.json
└── contracts/              ← Foundry project
    ├── src/
    │   ├── IQXToken.sol
    │   └── CryptoQuizNFT.sol
    ├── script/Deploy.s.sol
    └── test/CryptoQuiz.t.sol
```

---

### 💡 Airdrop Note

All participants qualify for the **$IQX airdrop** at TGE. NFT holders receive **priority allocation**.

<p align="center"><sub>© 2025 Crypto Quiz Quest. All rights reserved.</sub></p>
