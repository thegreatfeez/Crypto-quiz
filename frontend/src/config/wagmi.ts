import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string

const wagmiAdapter = new WagmiAdapter({
  networks: [baseSepolia],
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  projectId,
  metadata: {
    name: 'Crypto Quiz Quest',
    description: 'Earn IQX tokens and NFT badges by answering crypto questions',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: [],
  },
  features: {
    analytics: false,
  },
  themeMode: 'dark',
})

// Cast resolves the duplicate @wagmi/core version issue between wagmi and appkit-adapter-wagmi
export const wagmiConfig = wagmiAdapter.wagmiConfig as import('wagmi').Config
