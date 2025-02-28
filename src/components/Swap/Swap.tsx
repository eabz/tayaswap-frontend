'use client'

import { ERROR_APPROVE, ERROR_CALCULATING_TRADE, ERROR_ROUTE, ERROR_SWAP, WETH_ADDRESS } from '@/constants'
import { findBestRoute, useColorMode, useERC20Token, useTayaSwapRouter } from '@/hooks'
import { type ITokenListToken, usePools } from '@/services'
import { useTokenBalancesStore } from '@/stores'
import { formatTokenBalance } from '@/utils'
import { Box, HStack, IconButton, VStack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { parseUnits } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { SubmitButton } from '../Buttons'
import { GearIcon } from '../Icons'
import { ArrowUpArrowDownIcon } from '../Icons/ArrowUpArrowDown'
import { TokenSelectorModal } from '../Modals'
import { SwapToken } from './SwapToken'

// TODO: Change to a global state
const SLIPPAGE = 1

const DEFAULT_INITIAL_TOKEN_0 = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 10143,
  name: 'Monad Testnet',
  symbol: 'TMON',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/eabz/tayaswap-frontend/refs/heads/main/public/assets/tokens/mon.jpg'
}

const DEFAULT_INITIAL_TOKEN_1 = {
  address: '0x88b8e2161dedc77ef4ab7585569d2415a1c1055d',
  chainId: 10143,
  name: 'Tether USDT',
  symbol: 'USDT',
  decimals: 6,
  logoURI: 'https://raw.githubusercontent.com/eabz/taya-assets/master/blockchains/monad/usdt.png'
}

export function Swap() {
  const { colorMode } = useColorMode()

  const { data: pools } = usePools()

  const { address } = useAccount()

  const { data: walletClient } = useWalletClient()

  const publicClient = usePublicClient()

  const [token0, setToken0] = useState<ITokenListToken>(DEFAULT_INITIAL_TOKEN_0)
  const [loadingToken0Value, setLoadingToken0Value] = useState(false)
  const [token0Value, setToken0Value] = useState('0')

  const [token1, setToken1] = useState<ITokenListToken>(DEFAULT_INITIAL_TOKEN_1)
  const [loadingToken1Value, setLoadingToken1Value] = useState(false)
  const [token1Value, setToken1Value] = useState('0')

  const [actionLoading, setActionLoading] = useState(false)

  const { reloadTokenBalances } = useTokenBalancesStore()

  const [tokenSelectorDirection, setTokenSelectorDirection] = useState<'from' | 'to' | undefined>(undefined)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const { approved, approve } = useERC20Token()

  const { swapExactETHForTokens, swapExactTokensForETH, swapExactTokensForTokens } = useTayaSwapRouter()

  const checkApproved = useCallback(
    async (tokenAddress: string, inputAmount: bigint) => {
      if (!address || !publicClient) return

      if (tokenAddress !== WETH_ADDRESS) {
        const isApproved = await approved(address, tokenAddress, inputAmount, publicClient)
        setTokenApproved(isApproved)
      } else {
        setTokenApproved(true)
      }
    },
    [address, approved, publicClient]
  )

  const [tokenApproved, setTokenApproved] = useState(true)

  const handleTokenSelectorOpen = useCallback((direction: 'from' | 'to') => {
    setTokenSelectorDirection(direction)
    setTokenSelectorOpen(true)
  }, [])

  const { getFormattedTokenBalance } = useTokenBalancesStore()

  const handleToken0MaxClick = useCallback(() => {
    if (!getFormattedTokenBalance || !pools || !publicClient) return

    const max = getFormattedTokenBalance(token0.address)
    if (!max) return

    handleToken0InputChange(max)
  }, [getFormattedTokenBalance, token0.address, pools, publicClient])

  const handleToken0InputChange = useCallback(
    async (value: string) => {
      setLoadingToken1Value(true)

      setToken0Value(value)

      try {
        if (!pools || !publicClient || !address) return

        const inputAmount = parseUnits(value, token0.decimals)

        await checkApproved(token0.address, inputAmount)

        const { output } = await findBestRoute(inputAmount, token0.address, token1.address, pools, SLIPPAGE)

        const formattedOutput = formatTokenBalance(output, token1.decimals)

        setToken1Value(formattedOutput)
      } catch (err) {
        console.error(ERROR_CALCULATING_TRADE(token0.address, token1.address, err))
      }

      setLoadingToken1Value(false)
    },
    [token0, token1, pools, publicClient, address, checkApproved]
  )

  const handleToken1InputChange = useCallback(
    async (value: string) => {
      setLoadingToken0Value(true)
      setToken1Value(value)
      try {
        if (!pools || !publicClient) return

        const inputAmount = parseUnits(value, token1.decimals)

        const { output } = await findBestRoute(inputAmount, token1.address, token0.address, pools, SLIPPAGE)

        const formattedOutput = formatTokenBalance(output, token0.decimals)

        setToken0Value(formattedOutput)
      } catch (err) {
        console.error(ERROR_CALCULATING_TRADE(token0.address, token1.address, err))
      }

      setLoadingToken0Value(false)
    },
    [token0, token1, pools, publicClient]
  )

  const handleSwapClick = useCallback(async () => {
    if (!address || !publicClient) return

    setToken0(token1)
    setToken1(token0)
    setToken0Value(token1Value)
    setToken1Value(token0Value)

    const inputAmount = parseUnits(token0Value, token0.decimals)

    await checkApproved(token0.address, inputAmount)
  }, [address, publicClient, checkApproved, token0, token1, token0Value, token1Value])

  const handleApprove = useCallback(async () => {
    if (!address || !walletClient) return

    setActionLoading(true)
    const inputAmount = parseUnits(token0Value, token0.decimals)
    try {
      await approve(token0.address, inputAmount, walletClient)

      setTokenApproved(true)
    } catch (err) {
      console.error(ERROR_APPROVE(token0.address, inputAmount.toString(), err))
    }

    setActionLoading(false)
  }, [address, walletClient, token0.address, token0Value, token0.decimals, approve])

  const handleSwap = useCallback(async () => {
    if (!address || !walletClient || !publicClient || !pools) return

    const inputAmount = parseUnits(token0Value, token0.decimals)

    setActionLoading(true)

    const { route } = await findBestRoute(inputAmount, token0.address, token1.address, pools, SLIPPAGE)

    if (!route || route.length === 0) {
      console.error(ERROR_ROUTE(token0.address, token1.address))
      return
    }

    const amountOutMin = parseUnits(token1Value, token1.decimals)

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600)

    try {
      if (token0.address.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
        await swapExactETHForTokens(amountOutMin, route, address, walletClient, deadline, inputAmount)
      } else if (token1.address.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
        await swapExactTokensForETH(inputAmount, amountOutMin, route, address, walletClient, deadline)
      } else {
        await swapExactTokensForTokens(inputAmount, amountOutMin, route, address, walletClient, deadline)
      }
    } catch (err) {
      console.error(ERROR_SWAP(token0.address, token0Value, token1.address, token1Value, err))
    }

    await reloadTokenBalances(address, [
      { address: token0.address, decimals: token0.decimals },
      { address: token1.address, decimals: token1.decimals }
    ])

    setActionLoading(false)
  }, [
    address,
    walletClient,
    publicClient,
    pools,
    token0,
    token1,
    token0Value,
    token1Value,
    reloadTokenBalances,
    swapExactETHForTokens,
    swapExactTokensForETH,
    swapExactTokensForTokens
  ])

  const handleTokenSelect = (token: ITokenListToken) => {
    if (tokenSelectorDirection === 'from') {
      setToken0(token)
    }

    if (tokenSelectorDirection === 'to') {
      setToken1(token)
    }
  }

  return (
    <>
      <TokenSelectorModal
        open={tokenSelectorOpen}
        onSelectToken={handleTokenSelect}
        close={() => setTokenSelectorOpen(false)}
      />
      <Box
        width={{ base: '350px', lg: '430px' }}
        height="475px"
        boxShadow="md"
        borderRadius="25px"
        border="2px solid"
        borderColor="swap-border"
        bgImage={colorMode === 'dark' ? 'linear-gradient(#070E2B, #132E7F)' : 'linear-gradient(#142E78, #4762B9)'}
      >
        <VStack width="full" height="full" px="30px">
          <HStack justifyContent="end" width="full" py="3">
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
            onTokenSelectorClick={() => handleTokenSelectorOpen('to')}
            inputValue={token1Value}
            loading={loadingToken1Value}
          />

          <SubmitButton
            mt="15px"
            text={tokenApproved ? 'Trade' : 'Approve'}
            loading={actionLoading}
            onClickHandler={tokenApproved ? handleSwap : handleApprove}
            disabled={token0Value === '0' || token1Value === '0'}
            width="full"
          />
        </VStack>
      </Box>
    </>
  )
}
