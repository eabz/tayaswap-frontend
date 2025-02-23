'use client'

import { useMobile } from '@/hooks'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  //const { userTokenList, defaultTokenList } = useTokenListStore()

  //const { tokenBalances } = useTokenBalancesStore()

  const { mobile } = useMobile()

  return (
    <main>
      <Box
        background="background"
        h="100vh"
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
