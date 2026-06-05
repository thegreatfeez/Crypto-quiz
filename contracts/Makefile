-include .env

build:
	forge build

test:
	forge test -v

# ── Deploy + Verify (one command) ─────────────────────────────────────────────
deploy-sepolia:
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(RPC_URL_BASE_SEPOLIA) \
		--account myAccount \
		--sender $(SENDER_ADDRESS) \
		--broadcast \
		--verify \
		--verifier etherscan \
		--verifier-url $(VERIFY_URL_BASE_SEPOLIA) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--chain-id $(CHAIN_ID_BASE_SEPOLIA) \
		-vvvv

deploy-mainnet:
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(RPC_URL_BASE) \
		--account myAccount \
		--sender $(SENDER_ADDRESS) \
		--broadcast \
		--verify \
		--verifier etherscan \
		--verifier-url $(VERIFY_URL_BASE) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--chain-id $(CHAIN_ID_BASE) \
		-vvvv

# ── Post-hoc verify (only if --verify failed during deploy) ──────────────────
# Usage: make verify-sepolia VERIFY_ADDRESS=0x... VERIFY_CONTRACT=src/IQXToken.sol:IQXToken
verify-sepolia:
	forge verify-contract \
		$(VERIFY_ADDRESS) \
		$(VERIFY_CONTRACT) \
		--chain-id $(CHAIN_ID_BASE_SEPOLIA) \
		--verifier etherscan \
		--verifier-url $(VERIFY_URL_BASE_SEPOLIA) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--watch

.PHONY: build test deploy-sepolia deploy-mainnet verify-sepolia
