'use client'

import { useMobile } from '@/hooks'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  const { mobile } = useMobile()

  return (
    <main>
      <Box
        background="background"
        h={mobile ? 'calc(100vh - 80px)' : 'full'}
        position="absolute"
        top="0"
        ml={mobile ? '0px' : '300px'}
        mt="80px"
        width="full"
      >
        <Center width="full" height="full">
          Hello World!
        </Center>
      </Box>
    </main>
  )
}
