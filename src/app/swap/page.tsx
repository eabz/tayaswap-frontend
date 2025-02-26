'use client'

import { Swap } from '@/components'
import { HEADER_HEIGHT } from '@/constants'
import { Box, Center, HStack } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box mx={{ xl: '100px' }}>
      <HStack
        alignItems="center"
        position="relative"
        justifyContent="center"
        height={`calc(95vh - ${HEADER_HEIGHT})`}
        overflow="hidden"
      >
        <Center width="full" height="full">
          <Swap />
        </Center>
      </HStack>
    </Box>
  )
}
