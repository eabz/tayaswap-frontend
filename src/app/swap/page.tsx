'use client'

import { Swap } from '@/components'
import { Box, Center, HStack } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box pt="15px" mx={{ base: '15px', md: '20px', xl: '100px' }}>
      <HStack alignItems="center" position="relative" justifyContent="center" height="calc(100vh - 80px)">
        <Center width="full" height="full">
          <Swap />
        </Center>
      </HStack>
    </Box>
  )
}
