'use client'
import { usePools } from '@/services'
import { useTokenBalancesStore, useTokenListStore } from '@/stores'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export function TokenBalancesProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount()

  const { userTokenList, defaultTokenList } = useTokenListStore()

  const { data: pools, error, loading } = usePools()

  const { reloadTokenBalances, reloadPoolBalances } = useTokenBalancesStore()

  useEffect(() => {
    if (!address || !pools || loading || error) return

    const poolTokenAddresses = pools.map((pool) => pool.id)
    if (poolTokenAddresses.length > 0) {
      reloadPoolBalances(address, poolTokenAddresses)
    }
  }, [address, pools, loading, error, reloadPoolBalances])

  useEffect(() => {
    if (!address) return
    const mergedTokens = [...(userTokenList || []), ...(defaultTokenList || [])]

    const uniqueAddresses = Array.from(new Set(mergedTokens.map((token) => token.address)))

    if (uniqueAddresses.length > 0) {
      reloadTokenBalances(address, uniqueAddresses)
    }
  }, [address, userTokenList, defaultTokenList, reloadTokenBalances])

  return <>{children}</>
}
