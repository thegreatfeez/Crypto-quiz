import { createWalletClient, http, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const IQX_ADDRESS = '0xa2e502882f448d7f3bf571d4115a49323981de37' as const

const abi = [
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
] as const

export default async function handler(
  req: { method?: string; body: { address?: string; amount?: number } },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void },
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { address, amount } = req.body

  if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
    return res.status(400).json({ error: 'Invalid address' })
  }
  if (typeof amount !== 'number' || amount <= 0 || amount > 140) {
    return res.status(400).json({ error: 'Invalid amount (max 140 IQX per session)' })
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
      address: IQX_ADDRESS,
      abi,
      functionName: 'mint',
      args: [address as `0x${string}`, parseUnits(amount.toString(), 18)],
    })

    res.json({ hash })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Mint failed'
    res.status(500).json({ error: message })
  }
}
