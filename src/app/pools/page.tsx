'use client'

import { ActionButton, Input, PlusIcon, SearchIcon } from '@/components'
import { Box, Button, ButtonGroup, GridItem, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { useState } from 'react'

export default function Page() {
  //const { data: pools, loading, error } = usePools()

  //const { poolBalances } = useTokenBalancesStore()

  const [allPools, setAllPools] = useState(true)

  const handleSearch = (value: string) => {}

  const handlePoolCreate = () => {}

  return (
    <Box pt="15px" mx={{ base: '15px', md: '20px', xl: '100px' }}>
      <SimpleGrid width="full" columns={{ base: 2, lg: 3 }} gapY="15px" gapX="20px">
        <GridItem colSpan={1}>
          <Box background="button-group-background" rounded="full" p="1.5" width="195px">
            <ButtonGroup size="sm" variant="ghost">
              <Button
                rounded="full"
                onClick={() => setAllPools(true)}
                background={allPools ? 'button-group-button-background' : undefined}
                color={allPools ? 'button-group-button-active-color' : 'button-group-button-color'}
              >
                <Text>All Pools</Text>
              </Button>
              <Button
                rounded="full"
                onClick={() => setAllPools(false)}
                background={allPools ? undefined : 'button-group-button-background'}
                color={allPools ? 'button-group-button-color' : 'button-group-button-active-color'}
              >
                <Text>My Pools</Text>
              </Button>
            </ButtonGroup>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <HStack width="full" justifyContent="end">
            <ActionButton
              text="Create Pool"
              onClickHandler={handlePoolCreate}
              rounded="full"
              icon={<PlusIcon h="5" />}
            />
          </HStack>
        </GridItem>
        <GridItem colSpan={{ base: 2, lg: 1 }}>
          <HStack width="full" justifyContent="center">
            <Input
              placeholder="Search assets or address."
              size="md"
              type="text"
              minWidth="full"
              onChangeHandler={handleSearch}
              icon={<SearchIcon h="5" />}
            />
          </HStack>
        </GridItem>
      </SimpleGrid>
    </Box>
  )
}
