'use client'
import { useTokenBalancesStore, useTokenListStore } from '@/stores'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export function TokenBalancesProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount()

  const { userTokenList, defaultTokenList } = useTokenListStore()

  const { tokenBalances, reloadTokenBalances } = useTokenBalancesStore()
  console.log(tokenBalances)

  useEffect(() => {
    if (!userTokenList || !address) return
    reloadTokenBalances(address, userTokenList)
  }, [userTokenList, address, reloadTokenBalances])

  useEffect(() => {
    if (!defaultTokenList || !address) return
    reloadTokenBalances(address, defaultTokenList)
  }, [defaultTokenList, address, reloadTokenBalances])

  return <>{children}</>
}
