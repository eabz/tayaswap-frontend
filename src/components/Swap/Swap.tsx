'use client'

import { findBestRoute, useColorMode, useTayaSwapRouter } from '@/hooks'
import { usePools } from '@/services'
import { useTokenBalancesStore } from '@/stores'
import { formatTokenBalance } from '@/utils'
import { Box, HStack, IconButton, VStack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { parseUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { SubmitButton } from '../Buttons'
import { GearIcon } from '../Icons'
import { ArrowUpArrowDownIcon } from '../Icons/ArrowUpArrowDown'
import { SwapToken } from './SwapToken'

const DEFAULT_INITIAL_TOKEN_0 = {
  address: '0x760afe86e5de5fa0ee542fc7b7b713e1c5425701',
  chainId: 10143,
  name: 'Wrapped Monad',
  symbol: 'WMON',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/eabz/tayaswap-frontend/refs/heads/main/public/assets/tokens/wmon.jpg'
}

const DEFAULT_INITIAL_TOKEN_1 = {
  address: '0x88b8e2161dedc77ef4ab7585569d2415a1c1055d',
  chainId: 10143,
  name: 'tayUSDT',
  symbol: 'tayUSDT',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/eabz/taya-assets/master/blockchains/monad/usdt.png'
}

export function Swap() {
  const { colorMode } = useColorMode()

  const { calculateTradeOutput } = useTayaSwapRouter()

  const { data: pools } = usePools()

  const publicClient = usePublicClient()

  const [token0, setToken0] = useState(DEFAULT_INITIAL_TOKEN_0)
  const [loadingToken0Value, setLoadingToken0Value] = useState(false)
  const [token0Value, setToken0Value] = useState('1')

  const [token1, setToken1] = useState(DEFAULT_INITIAL_TOKEN_1)
  const [loadingToken1Value, setLoadingToken1Value] = useState(true)
  const [token1Value, setToken1Value] = useState('0')

  const [tokenSelectorDirection, setTokenSelectorDirection] = useState<'from' | 'to' | undefined>(undefined)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const handleTokenSelectorOpen = useCallback((direction: 'from' | 'to') => {
    setTokenSelectorDirection(direction)
    setTokenSelectorOpen(true)
  }, [])

  const { getFormattedTokenBalance } = useTokenBalancesStore()

  const handleToken0MaxClick = useCallback(() => {
    const max = getFormattedTokenBalance(token0.address)
    handleToken0InputChange(max)
  }, [getFormattedTokenBalance, token0.address])

  const handleToken1MaxClick = useCallback(() => {
    const max = getFormattedTokenBalance(token1.address)
    handleToken1InputChange(max)
  }, [getFormattedTokenBalance, token1.address])

  const handleToken0InputChange = useCallback(
    async (value: string) => {
      setLoadingToken1Value(true)
      setToken0Value(value)
      try {
        const inputAmount = parseUnits(value, token0.decimals)

        if (pools && publicClient) {
          const { route, output } = await findBestRoute(
            inputAmount,
            token0.address,
            token1.address,
            pools,
            publicClient
          )

          const formattedOutput = formatTokenBalance(output, token1.decimals)
          setToken1Value(formattedOutput)
        } else {
          setToken1Value('0')
        }
      } catch (error) {
        console.log(error)
        console.error('Error calculating trade output for token0:', error)
      }
      setLoadingToken1Value(false)
    },
    [token0, token1, pools, publicClient]
  )

  const handleToken1InputChange = useCallback(
    async (value: string) => {
      setLoadingToken0Value(true)
      setToken1Value(value)
      try {
        const inputAmount = parseUnits(value, token1.decimals)
        if (pools && publicClient) {
          const { route, output } = await findBestRoute(
            inputAmount,
            token1.address,
            token0.address,
            pools,
            publicClient
          )
          const formattedOutput = formatTokenBalance(output, token0.decimals)
          setToken0Value(formattedOutput)
        } else {
          setToken0Value('0')
        }
      } catch (error) {
        console.error('Error calculating trade output for token1:', error)
      }
      setLoadingToken0Value(false)
    },
    [token0, token1, pools, publicClient]
  )

  const handleSwapClick = () => {
    setToken0(token1)
    setToken1(token0)
    setToken0Value(token1Value)
    setToken1Value(token0Value)
  }

  return (
    <Box
      width={{ base: '340px', lg: '450px' }}
      height={{ base: '450px', lg: '550px' }}
      boxShadow="md"
      borderRadius="25px"
      mb="80px"
      border="2px solid"
      borderColor="swap-border"
      bgImage={colorMode === 'dark' ? 'linear-gradient(#070E2B, #132E7F)' : 'linear-gradient(#142E78, #4762B9)'}
    >
      <VStack width="full" height="full" px="30px">
        <HStack justifyContent="end" width="full" py="10">
          <IconButton variant="ghost" color="white" _hover={{ background: 'none' }}>
            <GearIcon />
          </IconButton>
        </HStack>

        <SwapToken
          direction="from"
          tokenAddress={token0.address}
          tokenSymbol={token0.symbol}
          onInputValueChange={handleToken0InputChange}
          onMaxClick={handleToken0MaxClick}
          onTokenSelectorClick={() => handleTokenSelectorOpen('from')}
          inputValue={token0Value}
          loading={loadingToken0Value}
        />

        <HStack width="full" justifyContent="center" mt="-4" mb="-4">
          <IconButton
            onClick={handleSwapClick}
            color="white"
            size="xl"
            background="swap-token-background"
            border="3px solid"
            borderColor="swap-change-button-border"
            rounded="full"
          >
            <ArrowUpArrowDownIcon height="24px" width="24px" color="text-contrast" />
          </IconButton>
        </HStack>
        <SwapToken
          direction="to"
          tokenAddress={token1.address}
          tokenSymbol={token1.symbol}
          onInputValueChange={handleToken1InputChange}
          onMaxClick={handleToken1MaxClick}
          onTokenSelectorClick={() => handleTokenSelectorOpen('to')}
          inputValue={token1Value}
          loading={loadingToken1Value}
        />

        <SubmitButton
          mt="30px"
          text="Trade"
          loading={false}
          onClickHandler={() => console.log('here')}
          disabled={false}
          width="full"
        />
      </VStack>
    </Box>
  )
}
