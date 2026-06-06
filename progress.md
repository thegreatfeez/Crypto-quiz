# Crypto Quiz Quest — Progress Tracker

## Project Goal
Add real blockchain to an existing crypto quiz app that previously used hardcoded/fake wallet IDs and simulated NFTs.

## Repo Structure
```
Crypto-quiz/
├── ARCHITECTURE.md          ← full design doc
├── progress.md              ← this file
├── README.md
├── .gitignore
├── github-finish-up-challenge.md  ← DEV.to article template (fill at the end)
│
├── frontend/                ← Vite + React + TypeScript app, Vercel root
│   ├── vercel.json          ← buildCommand: "npm run build", outputDirectory: "dist"
│   ├── index.html           ← root HTML (loads /src/main.tsx via <script type="module">)
│   ├── package.json         ← wagmi, viem, @reown/appkit, @tanstack/react-query, react
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env                 ← VITE_WALLETCONNECT_PROJECT_ID + server-side PRIVATE_KEY/RPC_URL
│   │
│   ├── src/
│   │   ├── main.tsx         ← WagmiProvider + QueryClientProvider + <App />
│   │   ├── App.tsx          ← state machine: start | quiz | result
│   │   ├── types.ts         ← Difficulty, Question interfaces
│   │   ├── vite-env.d.ts    ← /// <reference types="vite/client" />
│   │   ├── config/
│   │   │   └── wagmi.ts     ← AppKit init + WagmiAdapter for Base Sepolia
│   │   ├── contracts/
│   │   │   └── index.ts     ← IQX_ADDRESS, NFT_ADDRESS, iqxAbi, nftAbi (as const)
│   │   ├── data/
│   │   │   └── questionBank.ts  ← 90 questions (30 easy / 30 normal / 30 hard), TypeScript
│   │   └── components/
│   │       ├── StartScreen.tsx  ← difficulty selector, <appkit-button>, <WalletStatus>
│   │       ├── QuizScreen.tsx   ← timer, shuffled options, answer locking
│   │       ├── ResultScreen.tsx ← IQX claim, NFT claim, on-chain SVG display, <WalletStatus>
│   │       └── WalletStatus.tsx ← IQX balance + Bronze/Diamond/Platinum badge ownership
│   │
│   └── api/                 ← Vercel serverless functions (Node runtime)
│       ├── claim-iqx.ts     ← POST {address, amount} → mints IQX, returns {hash}
│       └── claim-nft.ts     ← POST {address, tier, score} → mints NFT, returns {hash}
│
└── contracts/               ← Foundry project
    ├── foundry.toml
    ├── .env.example
    ├── lib/
    │   └── openzeppelin-contracts/
    ├── src/
    │   ├── IQXToken.sol      ← DONE ✓ (deployed to Base Sepolia)
    │   └── CryptoQuizNFT.sol ← DONE ✓ (deployed to Base Sepolia)
    ├── script/
    │   └── Deploy.s.sol      ← DONE ✓
    └── test/
        └── CryptoQuiz.t.sol  ← DONE ✓ (10/10 passing)
```

---

## Steps

- [x] **Step 1** — Restructure repo
  - Moved frontend files into `frontend/`
  - Created `contracts/` with Foundry scaffold
  - Added `vercel.json`, `.gitignore`, `ARCHITECTURE.md`
  - Vercel dashboard: set Root Directory → `frontend` ← **you still need to do this manually**
  - GitHub About: paste Vercel URL into Website field ← **you still need to do this manually**

- [x] **Step 2** — Write contracts
  - `IQXToken.sol` — ERC-20, minter-only `mint(address, uint256)`
  - `CryptoQuizNFT.sol` — ERC-721, fully on-chain SVG via `tokenURI`, three tiers
  - `Deploy.s.sol` — broadcasts both contracts, logs addresses
  - `CryptoQuiz.t.sol` — 10 tests, all passing

- [x] **Step 3** — Deploy to Base Sepolia ✓
  - **IQXToken**: `0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5`
  - **CryptoQuizNFT**: `0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6`
  - Permissionless minting — no MINTER_ROLE, on-chain guards only

- [x] **Step 4** — Wire frontend ✓
  - Replaced vanilla JS static site with **Vite + React + TypeScript**
  - Wallet: **AppKit v1 (`@reown/appkit`)** — WalletConnect-based, `<appkit-button>` web component
  - Contract reads/writes: **wagmi v2** (`useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`)
  - Direct on-chain minting via `useWriteContract` — no backend, no private key stored anywhere
  - NFT display: on-chain SVG decoded client-side (`data:application/json;base64,...` → base64 → `<img>`)
  - `tokenId` extracted from `NFTMinted` event via `parseEventLogs` after tx confirms
  - `WalletStatus` component shows live IQX balance (`formatUnits(balanceOf, 18)`) + owned badge icons
  - Removed `frontend/NFT/` PNG folder — replaced by on-chain SVG

- [ ] **Step 5** — Test end-to-end on testnet
  - [ ] Run `npm run dev` in `frontend/`
  - [ ] Connect MetaMask / wallet on Base Sepolia
  - [ ] Complete a quiz at 70%+, claim IQX, claim NFT
  - [ ] Verify IQX balance and NFT badge appear in `WalletStatus`
  - [ ] Verify on-chain SVG renders correctly

- [ ] **Step 6** — Deploy to Base mainnet
- [ ] **Step 7** — Fill out `github-finish-up-challenge.md` and publish on DEV.to

---

## Contract Details

### IQXToken.sol
- **Standard**: ERC-20
- **Token name/symbol**: IQX Token / IQX
- **Deployed**: `0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5` (Base Sepolia)
- **Mint function**: `mint(uint256 amount)` — permissionless, mints to `msg.sender`
- **Rewards**: Easy=1 IQX, Normal=3 IQX, Hard=7 IQX per correct answer (20 questions)
- **Max per session**: 140 IQX (Hard, 20/20)

### CryptoQuizNFT.sol
- **Standard**: ERC-721
- **Name/symbol**: CryptoQuiz Badge / CQBADGE
- **Deployed**: `0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6` (Base Sepolia)
- **Tiers**: BRONZE=0, DIAMOND=1, PLATINUM=2
- **Mint function**: `mint(uint8 tier, uint8 score)` — permissionless, mints to `msg.sender`
- **Guard**: `hasClaimed[address][tier]` — one NFT per wallet per tier
- **Threshold**: score ≥ 14/20 (70%) to qualify
- **tokenURI**: fully on-chain, returns `data:application/json;base64,...` with SVG embedded
- **SVG design**:
  - Bronze — copper circle with "B" glyph, brown gradient background
  - Diamond — blue rhombus, dark blue gradient background
  - Platinum — silver five-pointed star, dark grey background
  - Each card shows: tier name, `Score: X / 20`, truncated wallet `0x1a2b...9f3c`

---

## Key Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Network | Base Sepolia → mainnet | Cheap gas, MetaMask-compatible, Coinbase-backed |
| Smart contract framework | Foundry | Faster test iteration than Hardhat |
| NFT type | Dynamic on-chain SVG | Unique per player, no IPFS dependency |
| Frontend stack | Vite + React + TypeScript | Required for wagmi v2 / AppKit hooks |
| Wallet UI | AppKit v1 (`@reown/appkit`) | WalletConnect-based, drop-in `<appkit-button>` |
| Contract reads | wagmi v2 (`useReadContract`) | React hooks, auto-refetch, type-safe |
| Minting pattern | Vercel API routes (server-side deployer key) | MINTER_ROLE stays server-side; any user can claim |
| Trust model | Off-chain quiz, on-chain claim | Score passed in by frontend (v1 simplicity) |
| Local dev | `vercel dev` for API routes | `/api/*` routes need Node runtime, not `vite dev` |

---

## Environment Variables

### `frontend/.env` (local dev — never commit `PRIVATE_KEY`)
```
VITE_WALLETCONNECT_PROJECT_ID=9fa0fe7c4ebd8521479305b7188c28cb
PRIVATE_KEY=<deployer private key>
RPC_URL=https://base-sepolia.g.alchemy.com/v2/QuFp-Q9U_Dztj3M8FdyUC-v_CPso_4v5
```

### Vercel dashboard (for deployed API routes)
Settings → Environment Variables → add:
- `PRIVATE_KEY` — deployer private key (with or without `0x` prefix)
- `RPC_URL` — Base Sepolia RPC URL

---

## Files Not to Touch
- `contracts/lib/` — managed by Foundry, do not edit
- `contracts/out/` — Foundry build output, gitignored
