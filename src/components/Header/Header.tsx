'use client'

import { HEADER_HEIGHT } from '@/constants'
import { useMobile } from '@/hooks'
import { useSidebarStore } from '@/stores'
import { Flex, HStack, IconButton } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MenuIcon } from '../Icons'

export function Header() {
  const { mobile } = useMobile()

  const { open, setOpen } = useSidebarStore()

  return (
    <Flex
      align="center"
      justify="space-between"
      width="100%"
      height={HEADER_HEIGHT}
      position="absolute"
      top="0"
      bg="menu-bg"
    >
      <HStack width="full" justifyContent={mobile ? 'space-between' : 'end'} px={mobile ? 5 : 20}>
        <IconButton onClick={() => setOpen(!open)} variant="ghost" size="xs" hideFrom="lg">
          <MenuIcon />
        </IconButton>
        <ConnectButton />
      </HStack>
    </Flex>
  )
}
