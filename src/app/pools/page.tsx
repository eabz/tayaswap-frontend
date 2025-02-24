'use client'

import { ActionButton, Input, PlusIcon, SearchIcon, Table, TokenIcon } from '@/components'
import { usePools } from '@/services'
import { useTokenBalancesStore } from '@/stores'
import { Box, Button, ButtonGroup, GridItem, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { matchSorter } from 'match-sorter'
import { useEffect, useState } from 'react'

interface IPoolData {
  id: string
  poolNumber: number
  poolName: string
  volumeUSD: number
  reserveUSD: number
  token0Symbol: string
  token0Name: string
  token0: string
  token1Symbol: string
  token1Name: string
  token1: string
}

const FILTER_POOLS = (pools: IPoolData[], query: string | undefined): IPoolData[] => {
  if (!query) return pools

  const filtered = matchSorter(pools, query, {
    keys: ['token0', 'token1', 'token1Symbol', 'token1Name', 'token0Symbol', 'token0Name']
  })

  return filtered
}

export default function Page() {
  const { data: pools, loading, error } = usePools()

  const columnHelper = createColumnHelper<IPoolData>()

  const [poolData, setPoolData] = useState<IPoolData[]>([])

  const [userPools, setUserPools] = useState<IPoolData[]>([])

  const { poolBalances } = useTokenBalancesStore()

  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const handleSearch = (value: string) => {
    if (value === '') {
      setSearchQuery(undefined)

      return
    }

    setSearchQuery(value)
  }

  useEffect(() => {
    if (!poolBalances || !pools || loading || error) return

    const cleanBalances = Object.fromEntries(
      // biome-ignore lint/style/useNamingConvention: find a way to ignore variables
      Object.entries(poolBalances).filter(([_, token]) => token.balance !== 0n)
    )

    const userPools = Object.keys(cleanBalances)

    const userPoolsFiltered = pools.filter((pool) => userPools.indexOf(pool.id) !== -1)

    const poolsParsed: IPoolData[] = userPoolsFiltered.map((pool, i) => {
      return {
        poolNumber: i + 1,
        poolName: `${pool.token0.symbol}/${pool.token1.symbol}`,
        id: pool.id,
        volumeUSD: Number.parseFloat(pool.volumeUSD),
        reserveUSD: Number.parseFloat(pool.reserveUSD),
        token0: pool.token0.id,
        token0Symbol: pool.token0.symbol,
        token0Name: pool.token0.name,
        token1: pool.token1.id,
        token1Symbol: pool.token1.symbol,
        token1Name: pool.token1.name
      }
    })

    const filtered = FILTER_POOLS(poolsParsed, searchQuery)

    setUserPools(filtered)
  }, [poolBalances, pools, loading, error, searchQuery])

  const [allPools, setAllPools] = useState(true)

  useEffect(() => {
    if (!pools || loading || error) return

    const poolsParsed: IPoolData[] = pools.map((pool, i) => {
      return {
        poolNumber: i + 1,
        poolName: `${pool.token0.symbol}/${pool.token1.symbol}`,
        id: pool.id,
        volumeUSD: Number.parseFloat(pool.volumeUSD),
        reserveUSD: Number.parseFloat(pool.reserveUSD),
        token0: pool.token0.id,
        token0Symbol: pool.token0.symbol,
        token0Name: pool.token0.name,
        token1: pool.token1.id,
        token1Symbol: pool.token1.symbol,
        token1Name: pool.token1.name
      }
    })

    const filtered = FILTER_POOLS(poolsParsed, searchQuery)

    setPoolData(filtered)
  }, [pools, loading, error, searchQuery])

  const handlePoolCreate = () => {}

  const handlePoolManage = (id: string) => {
    console.log(id)
  }

  const columns = [
    columnHelper.accessor('poolNumber', {
      header: () => '#',
      cell: (info) => <HStack justifyContent="center">{info.getValue()}</HStack>,
      size: 5,
      enableSorting: false
    }),
    columnHelper.accessor('poolName', {
      header: () => 'Pool',
      cell: (info) => (
        <HStack justifyContent="start" alignItems="center">
          <HStack>
            <TokenIcon marginRight="-4" token={info.row.original.token0} />
            <TokenIcon token={info.row.original.token1} />
          </HStack>

          {info.getValue()}
        </HStack>
      ),
      size: 20,
      enableSorting: false
    }),
    columnHelper.accessor('reserveUSD', {
      header: () => 'TVL',
      cell: (info) => <HStack justifyContent="center">{info.getValue()} USD</HStack>,
      size: 50
    }),
    columnHelper.accessor('volumeUSD', {
      header: () => 'Volume',
      cell: (info) => <HStack justifyContent="center">{info.getValue()} USD</HStack>,
      size: 50
    }),
    columnHelper.accessor('id', {
      header: () => 'Action',
      cell: (info) => (
        <Box position="relative" height="32px">
          <Stack height="full" justifyContent="center" alignItems="center">
            <ActionButton
              text="Manage"
              rounded="full"
              height="32px"
              width="90px"
              size="sm"
              onClickHandler={() => handlePoolManage(info.getValue())}
            />
          </Stack>
        </Box>
      ),
      size: 10,
      enableSorting: false
    })
  ]

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

      <Table columns={columns} loading={loading} data={allPools ? poolData : userPools} />
    </Box>
  )
}
