import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const NFT_ADDRESS = '0xdde133b8c6e033bc0321a3a2dd05f0734cec656b' as const

const abi = [
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
] as const

export default async function handler(
  req: { method?: string; body: { address?: string; tier?: number; score?: number } },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void },
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { address, tier, score } = req.body

  if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
    return res.status(400).json({ error: 'Invalid address' })
  }
  if (tier !== 0 && tier !== 1 && tier !== 2) {
    return res.status(400).json({ error: 'Invalid tier (0=Bronze, 1=Diamond, 2=Platinum)' })
  }
  if (typeof score !== 'number' || score < 0 || score > 20) {
    return res.status(400).json({ error: 'Invalid score' })
  }
  if (score < 14) {
    return res.status(400).json({ error: 'Score below 70% threshold' })
  }

  const rawKey = process.env.PRIVATE_KEY
  if (!rawKey) return res.status(500).json({ error: 'Server not configured (missing PRIVATE_KEY)' })

  const privateKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`

  try {
    const account = privateKeyToAccount(privateKey)
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.RPC_URL),
    })

    const hash = await client.writeContract({
      address: NFT_ADDRESS,
      abi,
      functionName: 'mint',
      args: [address as `0x${string}`, tier, score],
    })

    res.json({ hash })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Mint failed'
    // Surface the "Already claimed" contract revert cleanly
    if (message.includes('Already claimed')) {
      return res.status(400).json({ error: 'You already claimed this NFT tier.' })
    }
    res.status(500).json({ error: message })
  }
}
