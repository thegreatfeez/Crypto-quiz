import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { IQX_ADDRESS, NFT_ADDRESS, iqxAbi, nftAbi } from '../contracts'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()

  const { data: rawBalance } = useReadContract({
    address: IQX_ADDRESS,
    abi: iqxAbi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })

  const { data: hasBronze } = useReadContract({
    address: NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'hasClaimed',
    args: [address!, 0],
    query: { enabled: !!address },
  })

  const { data: hasDiamond } = useReadContract({
    address: NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'hasClaimed',
    args: [address!, 1],
    query: { enabled: !!address },
  })

  const { data: hasPlatinum } = useReadContract({
    address: NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'hasClaimed',
    args: [address!, 2],
    query: { enabled: !!address },
  })

  if (!isConnected || !address) return null

  const iqxBalance = rawBalance ? formatUnits(rawBalance as bigint, 18) : '0'
  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`
  const anyNFT = hasBronze || hasDiamond || hasPlatinum

  return (
    <div className="bg-gray-700 rounded-lg px-4 py-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Wallet</span>
        <span className="text-green-400 font-mono">{shortAddr}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400"><i className="fas fa-coins mr-1 text-yellow-400"></i>IQX Balance</span>
        <span className="text-yellow-300 font-bold">{parseFloat(iqxBalance).toLocaleString()} IQX</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400"><i className="fas fa-gem mr-1 text-purple-400"></i>NFT Badges</span>
        <div className="flex gap-2">
          <span title="Bronze" className={hasBronze ? 'opacity-100 text-lg' : 'opacity-25 text-lg grayscale'}>🥉</span>
          <span title="Diamond" className={hasDiamond ? 'opacity-100 text-lg' : 'opacity-25 text-lg grayscale'}>💎</span>
          <span title="Platinum" className={hasPlatinum ? 'opacity-100 text-lg' : 'opacity-25 text-lg grayscale'}>🏆</span>
        </div>
      </div>

      {!anyNFT && (
        <p className="text-xs text-gray-500 text-center">Score 70%+ to earn an NFT badge</p>
      )}
    </div>
  )
}
