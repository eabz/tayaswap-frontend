'use client'
import { Box, HStack } from '@chakra-ui/react'
import { TokenIcon } from './TokenIcon'

interface ITokenIconGroup {
  token0: string
  token1: string
  size?: string
}

export function TokenIconGroup({ size = '40px', token0, token1 }: ITokenIconGroup) {
  return (
    <HStack alignItems="center" position="relative" justifyContent="center">
      <Box mr="-4" width={size} height={size} position="relative" borderRadius="full" overflow="hidden">
        <TokenIcon token={token0} />
      </Box>
      <Box width={size} height={size} position="relative" borderRadius="full" overflow="hidden">
        <TokenIcon token={token1} />
      </Box>
    </HStack>
  )
}
