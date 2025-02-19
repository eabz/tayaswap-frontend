'use client'

import { useColorMode } from '@/hooks'
import { ClientOnly } from '@chakra-ui/react'
import Image from 'next/image'

export const SideBarLogo = () => {
  const { colorMode } = useColorMode()

  return (
    <ClientOnly fallback={<Image src={'/logo-dark.svg'} width={100} height={100} alt="TayaSwap Interface" />}>
      <Image
        src={colorMode === 'dark' ? '/logo-dark.svg' : '/logo-white.svg'}
        width={100}
        height={100}
        alt="TayaSwap Interface"
      />
    </ClientOnly>
  )
}
