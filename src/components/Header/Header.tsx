'use client'

import { Flex, HStack } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header = () => {
  return (
    <Flex as="nav" align="center" justify="space-between" width="100%" position="absolute" height="90px" bg="menu-bg">
      <HStack width="full" justifyContent="end" px={20}>
        <ConnectButton />
      </HStack>
    </Flex>
  )
}
