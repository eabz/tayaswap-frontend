'use client'
import { type ITokenListToken, usePools } from '@/services'
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

    const poolTokenData: { address: string; decimals: number }[] = pools.map((pool) => ({
      address: pool.id,
      decimals: 18
    }))

    if (poolTokenData.length > 0) {
      reloadPoolBalances(address, poolTokenData)
    }
  }, [address, pools, loading, error, reloadPoolBalances])

  useEffect(() => {
    if (!address) return

    const mergedTokens = [...(userTokenList || []), ...(defaultTokenList || [])]

    const uniqueTokensMap = new Map<string, ITokenListToken>()

    for (let i = 0; i < mergedTokens.length; i++) {
      const token = mergedTokens[i]

      if (!uniqueTokensMap.has(token.address)) {
        uniqueTokensMap.set(token.address, token)
      }
    }

    const uniqueTokens = Array.from(uniqueTokensMap.values())

    if (uniqueTokens.length > 0) {
      reloadTokenBalances(address, uniqueTokens)
    }
  }, [address, userTokenList, defaultTokenList, reloadTokenBalances])

  return <>{children}</>
}
