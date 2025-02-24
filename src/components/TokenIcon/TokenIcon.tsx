'use client'

import type { ITokenListToken } from '@/services'
import { useTokenListStore } from '@/stores'
import Image from 'next/image'
import { useMemo } from 'react'

interface ITokenIcon {
  token: string
}

export function TokenIcon({ token }: ITokenIcon) {
  const { defaultTokenList } = useTokenListStore()

  const image = useMemo(() => {
    const tokenListData: ITokenListToken | undefined = defaultTokenList.find(
      (listToken) => listToken.address.toLowerCase() === token.toLowerCase()
    )

    if (!tokenListData || !tokenListData.logoURI) return '/assets/unknown.svg'

    return tokenListData.logoURI
  }, [token, defaultTokenList])

  return <Image fill src={image} alt="Token Icon Image" sizes="(max-width: 50px)" />
}
