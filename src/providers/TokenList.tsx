'use client'

import { useTokensList } from '@/services'
import { useTokenListState } from '@/state'
import { useEffect } from 'react'

export function TokenListProvider({ children }: { children: React.ReactNode }) {
  const { data: tokenList, loading, error } = useTokensList()
  const { setDefaultTokenList } = useTokenListState()

  useEffect(() => {
    if (loading || error || !tokenList) return

    setDefaultTokenList(tokenList)
  }, [tokenList, loading, error, setDefaultTokenList])

  return <>{children}</>
}
