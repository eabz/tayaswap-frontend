'use client'

import type { ITokenListToken } from '@/services'
import { useTokenListStore } from '@/stores'
import { Avatar, type AvatarRootProps } from '@chakra-ui/react'
import { useMemo } from 'react'

interface ITokenIcon extends AvatarRootProps {
  token: string
}

export function TokenIcon({ token, ...props }: ITokenIcon) {
  const { defaultTokenList } = useTokenListStore()

  const image = useMemo(() => {
    const tokenListData: ITokenListToken | undefined = defaultTokenList.find(
      (listToken) => listToken.address.toLowerCase() === token.toLowerCase()
    )

    if (!tokenListData || !tokenListData.logoURI) return '/assets/unknown.svg'

    return tokenListData.logoURI
  }, [token, defaultTokenList])

  return (
    <Avatar.Root size="xs" {...props}>
      <Avatar.Image src={image} />
    </Avatar.Root>
  )
}
