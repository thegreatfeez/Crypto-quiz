export const IQX_ADDRESS = '0x99Ea7dCDfDaaA8F90450179Ed12B9B82ef7662A5' as const
export const NFT_ADDRESS = '0xcEe398BeD8205b47e30bd16e319ADFD94B54A5b6' as const

export const iqxAbi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [{ name: 'amount', type: 'uint256' }],
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

