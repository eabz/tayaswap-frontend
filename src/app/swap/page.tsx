'use client'

import { useMobile } from '@/hooks'
import { useTokenBalancesStore, useTokenListStore } from '@/stores'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  const { userTokenList, defaultTokenList } = useTokenListStore()
  console.log(userTokenList, defaultTokenList)

  const { tokenBalances } = useTokenBalancesStore()
  console.log(tokenBalances)

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
