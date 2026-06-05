import { useState, useEffect } from 'react'
import { useAccount, useWaitForTransactionReceipt, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits, parseEventLogs } from 'viem'
import { NFT_ADDRESS, IQX_ADDRESS, nftAbi, iqxAbi } from '../contracts'
import WalletStatus from './WalletStatus'
import type { Difficulty } from '../types'

interface ResultScreenProps {
  score: number
  totalIQX: number
  difficulty: Difficulty
  tier: 0 | 1 | 2
  onRetry: () => void
}

const TIER_LABELS = ['🥉 Bronze', '💎 Diamond', '🏆 Platinum']

function parseTokenURI(uri: string): string | null {
  try {
    const json = JSON.parse(atob(uri.split(',')[1]))
    return (json.image as string) ?? null
  } catch {
    return null
  }
}

export default function ResultScreen({ score, totalIQX, tier, onRetry }: ResultScreenProps) {
  const { address, isConnected } = useAccount()
  const qualifiesForNFT = score >= 14

  const { writeContractAsync } = useWriteContract()

  const [iqxHash, setIqxHash] = useState<`0x${string}` | undefined>()
  const [nftHash, setNftHash] = useState<`0x${string}` | undefined>()
  const [iqxPending, setIqxPending] = useState(false)
  const [nftPending, setNftPending] = useState(false)
  const [iqxDone, setIqxDone] = useState(false)
  const [nftDone, setNftDone] = useState(false)
  const [nftTokenId, setNftTokenId] = useState<bigint | undefined>()
  const [claimError, setClaimError] = useState<string | null>(null)

  const { isSuccess: iqxConfirmed } = useWaitForTransactionReceipt({
    hash: iqxHash,
    query: { enabled: !!iqxHash },
  })

  const { isSuccess: nftConfirmed, data: nftReceipt } = useWaitForTransactionReceipt({
    hash: nftHash,
    query: { enabled: !!nftHash },
  })

  const { data: alreadyClaimed, refetch: refetchClaimed } = useReadContract({
    address: NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'hasClaimed',
    args: [address ?? '0x0000000000000000000000000000000000000000', tier],
    query: { enabled: isConnected && !!address && qualifiesForNFT },
  })

  const { data: tokenURIData } = useReadContract({
    address: NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'tokenURI',
    args: [nftTokenId ?? 0n],
    query: { enabled: nftTokenId !== undefined },
  })

  useEffect(() => {
    if (iqxConfirmed) setIqxDone(true)
  }, [iqxConfirmed])

  useEffect(() => {
    if (nftConfirmed && nftReceipt) {
      try {
        const logs = parseEventLogs({ abi: nftAbi, eventName: 'NFTMinted', logs: nftReceipt.logs })
        if (logs[0]) setNftTokenId(logs[0].args.tokenId)
      } catch { /* best-effort */ }
      setNftDone(true)
      refetchClaimed()
    }
  }, [nftConfirmed, nftReceipt, refetchClaimed])

  async function handleClaimIQX() {
    setClaimError(null)
    setIqxPending(true)
    try {
      const hash = await writeContractAsync({
        address: IQX_ADDRESS,
        abi: iqxAbi,
        functionName: 'mint',
        args: [parseUnits(totalIQX.toString(), 18)],
      })
      setIqxHash(hash)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Claim failed'
      setClaimError(msg.includes('rejected') || msg.includes('denied') ? 'Transaction cancelled.' : msg)
    } finally {
      setIqxPending(false)
    }
  }

  async function handleClaimNFT() {
    setClaimError(null)
    setNftPending(true)
    try {
      const hash = await writeContractAsync({
        address: NFT_ADDRESS,
        abi: nftAbi,
        functionName: 'mint',
        args: [tier, score],
      })
      setNftHash(hash)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'NFT claim failed'
      setClaimError(msg.includes('rejected') || msg.includes('denied') ? 'Transaction cancelled.' : msg)
    } finally {
      setNftPending(false)
    }
  }

  const svgDataUri = tokenURIData ? parseTokenURI(tokenURIData as string) : null
  const tierLabel = TIER_LABELS[tier]

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-xl text-center space-y-4">
      <h2 className="text-2xl font-bold text-yellow-300">
        <i className="fas fa-trophy mr-2"></i>Quiz Complete!
      </h2>

      <p>Your Score: <span className="font-bold text-white">{score}/20</span></p>
      <p>
        Total IQX Earned: <span className="font-bold text-yellow-400">{totalIQX}</span>{' '}
        <i className="fas fa-coins text-yellow-400"></i>
      </p>

      <div className="space-y-2">
        <div className="flex justify-center">
          <appkit-button />
        </div>
        <WalletStatus />
      </div>

      {claimError && (
        <div className="bg-red-900 border border-red-500 text-red-200 text-sm rounded px-4 py-2 text-left">
          ⚠️ {claimError}
        </div>
      )}

      {/* ── IQX Claim ── */}
      {isConnected && !iqxDone && (
        <button
          onClick={handleClaimIQX}
          disabled={iqxPending || !!iqxHash}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed w-full py-2 rounded text-gray-900 font-bold"
        >
          {iqxPending
            ? <><i className="fas fa-spinner fa-spin mr-2"></i>Confirm in wallet…</>
            : iqxHash
            ? <><i className="fas fa-clock mr-2"></i>Waiting for confirmation…</>
            : <><i className="fas fa-coins mr-2"></i>Claim {totalIQX} IQX</>}
        </button>
      )}

      {iqxDone && (
        <div className="bg-green-800 border border-green-600 text-green-200 rounded px-4 py-2 text-sm">
          ✅ {totalIQX} IQX minted to your wallet!
        </div>
      )}

      {/* ── NFT Section ── */}
      {qualifiesForNFT ? (
        <div className="space-y-3 border-t border-gray-600 pt-4">
          <p className="text-green-400 font-semibold">🎉 You qualified for the {tierLabel} NFT!</p>

          {svgDataUri ? (
            <div className="flex flex-col items-center gap-1">
              <img
                src={svgDataUri}
                alt={`${tierLabel} NFT`}
                className="w-44 h-44 rounded-xl shadow-lg mx-auto border border-gray-600"
              />
              <p className="text-xs text-gray-400">On-chain SVG — stored forever on Base</p>
            </div>
          ) : (
            <div className={`mx-auto w-40 h-40 rounded-lg shadow-lg flex items-center justify-center text-5xl ${
              tier === 0 ? 'bg-yellow-900 border border-yellow-600'
              : tier === 1 ? 'bg-blue-900 border border-blue-400'
              : 'bg-gray-700 border border-gray-400'
            }`}>
              {tier === 0 ? '🥉' : tier === 1 ? '💎' : '🏆'}
            </div>
          )}

          {isConnected && !nftDone && (
            alreadyClaimed ? (
              <p className="text-sm text-gray-400">You already own this badge.</p>
            ) : (
              <button
                onClick={handleClaimNFT}
                disabled={nftPending || !!nftHash}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-6 rounded text-white font-bold"
              >
                {nftPending
                  ? <><i className="fas fa-spinner fa-spin mr-2"></i>Confirm in wallet…</>
                  : nftHash
                  ? <><i className="fas fa-clock mr-2"></i>Waiting for confirmation…</>
                  : <><i className="fas fa-gift mr-2"></i>Claim {tierLabel} NFT</>}
              </button>
            )
          )}

          {nftDone && !svgDataUri && (
            <p className="text-sm text-gray-400 animate-pulse">
              <i className="fas fa-spinner fa-spin mr-1"></i>Loading your NFT art…
            </p>
          )}

          {nftDone && (
            <p className="text-sm text-yellow-300">
              🚀 NFT minted! NFT holders get priority access during the IQX TGE.
            </p>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-600 pt-4 text-sm text-center space-y-2">
          <p className="text-red-300">🚫 Score below 70% — no NFT this round.</p>
          <p className="text-gray-300">
            You still qualify for the <span className="text-yellow-400 font-semibold">IQX airdrop</span>.
            NFT holders get <span className="text-green-400 font-semibold">priority access</span> at TGE.
          </p>
        </div>
      )}

      <button
        onClick={onRetry}
        className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-white"
      >
        <i className="fas fa-redo mr-2"></i>Try Again
      </button>
    </div>
  )
}
