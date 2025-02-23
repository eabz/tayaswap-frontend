'use client'

import { useMobile } from '@/hooks'
import { Box, Button, ButtonGroup, HStack, Input } from '@chakra-ui/react'
import { useState } from 'react'

export default function Page() {
  //const { data: pools, loading, error } = usePools()

  //const { poolBalances } = useTokenBalancesStore()

  const { mobile } = useMobile()

  const [allPools, setAllPools] = useState(true)

  return (
    <main>
      <Box
        background="background"
        h="100vh"
        position="absolute"
        top="80px"
        left={mobile ? '0px' : '300px'}
        width="calc(100vw - 300px)"
        zIndex="0"
      >
        <HStack mx="200px" pt="5" justifyContent="space-between">
          <Box background="white" rounded="full" p="1.5">
            <ButtonGroup size="sm" variant="ghost" fontFamily="Nunito" fontWeight="600">
              <Button rounded="full" onClick={() => setAllPools(true)} background={allPools ? 'background' : 'white'}>
                All Pools
              </Button>
              <Button rounded="full" onClick={() => setAllPools(false)} background={allPools ? 'white' : 'background'}>
                My Pools
              </Button>
            </ButtonGroup>
          </Box>
          <HStack>
            <Button>Create Pool</Button>
            <Input placeholder="Search assets or address" />
          </HStack>
        </HStack>
      </Box>
    </main>
  )
}
