# Crypto Quiz Quest — Architecture

## Repository Structure

```
Crypto-quiz/
├── ARCHITECTURE.md
├── README.md
├── progress.md
├── .gitignore
│
├── frontend/                     ← Vite + React + TypeScript app — Vercel root
│   ├── vercel.json               ← buildCommand: "npm run build", outputDirectory: "dist"
│   ├── index.html                ← Vite entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env                      ← VITE_WALLETCONNECT_PROJECT_ID (gitignored)
│   ├── src/
│   │   ├── main.tsx              ← WagmiProvider + QueryClientProvider
│   │   ├── App.tsx               ← state machine: start | quiz | result
│   │   ├── types.ts
│   │   ├── config/
│   │   │   └── wagmi.ts          ← AppKit init, WagmiAdapter, Base Sepolia config
│   │   ├── contracts/
│   │   │   └── index.ts          ← deployed addresses + ABI definitions
│   │   ├── data/
│   │   │   └── questionBank.ts   ← 90 questions (30 easy / 30 normal / 30 hard)
│   │   └── components/
│   │       ├── StartScreen.tsx   ← difficulty selector, wallet connect, WalletStatus
│   │       ├── QuizScreen.tsx    ← timer, shuffled options, answer locking
│   │       ├── ResultScreen.tsx  ← IQX/NFT claim, on-chain SVG display
│   │       └── WalletStatus.tsx  ← live IQX balance + owned badge icons
│   └── node_modules/             ← gitignored
│
└── contracts/                    ← Foundry project
    ├── foundry.toml
    ├── .env.example
    ├── src/
    │   ├── IQXToken.sol          ← ERC-20, permissionless mint, max 140/tx
    │   └── CryptoQuizNFT.sol     ← ERC-721, on-chain SVG, score guard, hasClaimed
    ├── script/
    │   └── Deploy.s.sol
    ├── test/
    │   └── CryptoQuiz.t.sol      ← 12 tests, all passing
    └── lib/                      ← gitignored (restored with forge install)
```

---

## Network

| Environment | Network      | Purpose                            |
|-------------|------------- |------------------------------------|
| Development | Base Sepolia | Free testnet, faucet available     |
| Production  | Base mainnet | Cheap gas, EVM-compatible          |

Testnet ETH: https://faucet.quicknode.com/base/sepolia

---

## Smart Contracts

### IQXToken.sol — ERC-20

Permissionless ERC-20 reward token. Any caller can mint up to 140 IQX per transaction (Hard mode max: 20 questions × 7 IQX). Tokens mint directly to `msg.sender`.

```solidity
function mint(uint256 amount) external {
    require(amount > 0 && amount <= 140 * 10 ** 18, "Amount out of range");
    _mint(msg.sender, amount);
}
```

| Difficulty | IQX per correct | Max possible |
|------------|-----------------|--------------|
| Easy       | 1 IQX           | 20 IQX       |
| Normal     | 3 IQX           | 60 IQX       |
| Hard       | 7 IQX           | 140 IQX      |

### CryptoQuizNFT.sol — ERC-721

On-chain SVG NFT with three badge tiers. Permissionless mint with two on-chain guards:
- `score >= 14` (70% of 20 questions)
- `hasClaimed[msg.sender][tier]` — one NFT per wallet per tier

```solidity
function mint(uint8 tier, uint8 score) external {
    require(tier  <= PLATINUM,             "Invalid tier");
    require(score >= 14,                   "Score below threshold");
    require(score <= 20,                   "Invalid score");
    require(!hasClaimed[msg.sender][tier], "Already claimed this tier");
    // ... mint on-chain SVG to msg.sender
}
```

**On-chain SVG:** `tokenURI()` returns a fully self-contained `data:application/json;base64,...` string. The JSON contains a `data:image/svg+xml;base64,...` image. Nothing is stored off-chain.

| Tier     | Difficulty | Visual          |
|----------|------------|-----------------|
| Bronze   | Easy       | Copper coin on brown gradient |
| Diamond  | Normal     | Blue rhombus on dark blue gradient |
| Platinum | Hard       | Silver star on dark grey gradient |

---

## Trust Model

Quiz logic runs off-chain in the browser. The player's score is passed to the contract on claim. The contract verifies `score >= 14` but cannot verify the score was earned fairly — this is the v1 trade-off in exchange for having no backend or stored private keys.

**v2 upgrade path**: Add an off-chain signer. The server issues a signed message `(player, score, difficulty, nonce)` after verifying quiz completion server-side. The contract verifies the EIP-712 signature before minting.

---

## Frontend Architecture

### Wallet Connection
AppKit v1 (`@reown/appkit`) provides the `<appkit-button>` web component and modal. The `WagmiAdapter` bridges AppKit to wagmi v2 hooks. Network is fixed to Base Sepolia.

### Minting Flow
```
1. User completes quiz → score computed client-side
2. Result screen shown → "Claim IQX" button enabled
3. User clicks Claim IQX → wagmi writeContractAsync({ mint(amount) })
4. Wallet prompt appears → user signs transaction
5. useWaitForTransactionReceipt tracks on-chain confirmation
6. If score ≥ 14 → "Claim NFT" button enabled
7. User clicks Claim NFT → wagmi writeContractAsync({ mint(tier, score) })
8. After NFT confirms → parseEventLogs extracts tokenId from NFTMinted event
9. useReadContract(tokenURI, [tokenId]) fetches on-chain SVG
10. SVG decoded client-side: atob(uri.split(',')[1]) → JSON → image field
11. Rendered as <img src={svgDataUri} />
```

### WalletStatus Component
Reads live on-chain state on every render:
- `IQXToken.balanceOf(address)` → formatted with `formatUnits(balance, 18)`
- `CryptoQuizNFT.hasClaimed(address, 0/1/2)` → three badge ownership flags

---

## Vercel Deployment

`frontend/` is the Vercel root. One-time dashboard config required:

> Settings → General → Root Directory → `frontend`

Every push to `main` triggers an auto-deploy. No environment variables needed (contracts are permissionless — no server-side key required).

---

## Deployed Contracts (Base Sepolia)

| Contract      | Address |
|---------------|---------|
| IQXToken      | `0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5` |
| CryptoQuizNFT | `0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6` |
