'use client'

import { useMobile } from '@/hooks'
import { useTokensList } from '@/services/tokens'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  const { data: tokenList, loading, error } = useTokensList()
  console.log(tokenList, loading, error)

  const { mobile } = useMobile()

  return (
    <main>
      <Box
        background="background"
        h={mobile ? 'calc(100vh - 80px)' : 'full'}
        position="absolute"
        top="0"
        ml={mobile ? '0px' : '150px'}
        width="full"
        zIndex="0"
      >
        <Center width="full" height="full">
          Hello World!
        </Center>
      </Box>
    </main>
  )
}
