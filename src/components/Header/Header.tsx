'use client'

import { useBreakpoint } from '@/hooks'
import { useSidebar } from '@/state'
import { Flex, HStack, IconButton } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MenuIcon } from '../Icons'

export const Header = () => {
  const { mobile } = useBreakpoint()

  const { open, setOpen } = useSidebar()

  return (
    <Flex as="nav" align="center" justify="space-between" width="100%" position="absolute" height="80px" bg="menu-bg">
      <HStack width="full" justifyContent={mobile ? 'space-between' : 'end'} px={mobile ? 10 : 20}>
        <IconButton onClick={() => setOpen(!open)} variant="ghost" size="xs" hideFrom="lg">
          <MenuIcon />
        </IconButton>
        <ConnectButton />
      </HStack>
    </Flex>
  )
}
