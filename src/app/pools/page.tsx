'use client'

import { UnderConstruction } from '@/components'
import { useBreakpoint } from '@/hooks'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  const { mobile } = useBreakpoint()

  return (
    <main>
      <Box
        background="background"
        h="full"
        position="absolute"
        top="0"
        ml={mobile ? '0px' : '100px'}
        mt="80px"
        width="full"
      >
        <Center width="full" height="full">
          <UnderConstruction />
        </Center>
      </Box>
    </main>
  )
}
