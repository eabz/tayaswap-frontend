'use client'

import { Swap } from '@/components'
import { Box, HStack } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box mx={{ base: '15px', md: '20px', xl: '100px' }}>
      <HStack justifyContent="center" width="full">
        <Swap />
      </HStack>
    </Box>
  )
}
