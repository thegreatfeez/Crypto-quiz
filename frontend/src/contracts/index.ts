export const IQX_ADDRESS = '0xa2e502882f448d7f3bf571d4115a49323981de37' as const
export const NFT_ADDRESS = '0xdde133b8c6e033bc0321a3a2dd05f0734cec656b' as const

export const iqxAbi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export const nftAbi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'score', type: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasClaimed',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'NFTMinted',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tier', type: 'uint8', indexed: false },
      { name: 'score', type: 'uint8', indexed: false },
      { name: 'tokenId', type: 'uint256', indexed: false },
    ],
  },
] as const
