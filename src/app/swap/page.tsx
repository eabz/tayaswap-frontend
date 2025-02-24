'use client'
import { Box, Center } from '@chakra-ui/react'

export default function Page() {
  //const { userTokenList, defaultTokenList } = useTokenListStore()

  //const { tokenBalances } = useTokenBalancesStore()

  //const { mobile } = useMobile()

  return (
    <Box pt="15px" mx={{ base: '15px', md: '20px', xl: '100px' }}>
      <Center width="full" height="full">
        Hello World!
      </Center>
    </Box>
  )
}
