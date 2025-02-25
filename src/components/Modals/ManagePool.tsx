'use client'

import { useERC20Token, usePermitSignature, useTayaSwapRouter } from '@/hooks'
import type { IPairData } from '@/services'
import { useTokenBalancesStore } from '@/stores'
import { ROUTER_ADDRESS, WETH_ADDRESS, formatTokenBalance } from '@/utils'
import {
  Box,
  Button,
  Center,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  HStack,
  IconButton,
  Text,
  VStack
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { ActionButton, SubmitButton } from '../Buttons'
import { ChevronLeftIcon, CloseIcon, PlusIcon } from '../Icons'
import { TokenAmountInput } from '../Input'
import { Slider } from '../Slider'
import { TokenIconGroup } from '../TokenIcon'

enum View {
  Selector = 0,
  AddLiquidity = 1,
  RemoveLiquidity = 2
}

const VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0
  })
}

export function calculateWithdrawAmounts(
  userBalance: string,
  totalSupply: string,
  token0: { reserve: string; decimals: string },
  token1: { reserve: string; decimals: string }
): { amountToken0: string; amountToken1: string } {
  if (totalSupply === '0') {
    return { amountToken0: '0', amountToken1: '0' }
  }

  const userLiquidity = parseUnits(userBalance, 18)
  const totalSupplyAmount = parseUnits(totalSupply, 18)

  const token0Decimals = Number.parseInt(token0.decimals)
  const token1Decimals = Number.parseInt(token1.decimals)

  const token0Reserve = parseUnits(token0.reserve, token0Decimals)
  const token1Reserve = parseUnits(token1.reserve, token1Decimals)

  return {
    amountToken0: formatTokenBalance((userLiquidity * token0Reserve) / totalSupplyAmount, token0Decimals),
    amountToken1: formatTokenBalance((userLiquidity * token1Reserve) / totalSupplyAmount, token1Decimals)
  }
}

interface IViewProps {
  direction: number
  changeView: (view: View) => void
  pool: IPairData
}

function SelectActionView({ direction, changeView }: IViewProps) {
  return (
    <motion.div
      key="selector"
      custom={direction}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', width: '100%' }}
    >
      <VStack height="325px" justifyContent="center" alignItems="center" gap="30px">
        <Button
          background="modal-selector-button-background"
          color="button-group-button-active-color"
          _hover={{ background: 'button-group-button-background' }}
          onClick={() => changeView(View.AddLiquidity)}
          rounded="15px"
          width="300px"
          height="90px"
        >
          <VStack width="full" alignItems="start">
            <Text fontSize="18px" fontWeight="600">
              Add Liquidity
            </Text>
            <Text fontWeight="300">Increase the amount of tokens in the pool.</Text>
          </VStack>
        </Button>
        <Button
          background="modal-selector-button-background"
          color="button-group-button-active-color"
          _hover={{ background: 'button-group-button-background' }}
          onClick={() => changeView(View.RemoveLiquidity)}
          width="300px"
          rounded="15px"
          height="90px"
        >
          <VStack width="full" alignItems="start">
            <Text fontSize="18px" fontWeight="600">
              Remove Liquidity
            </Text>
            <Text fontWeight="300">Reduce the amount of tokens in the pool.</Text>
          </VStack>
        </Button>
      </VStack>
    </motion.div>
  )
}

function AddLiquidityView({ direction, pool }: IViewProps) {
  const [token0Value, setToken0Value] = useState('0')
  const [token1Value, setToken1Value] = useState('0')

  const [loadingToken0, setLoadingToken0] = useState(false)
  const [loadingToken1, setLoadingToken1] = useState(false)

  const { tokenBalances, getFormattedTokenBalance } = useTokenBalancesStore()

  const { approved, approve } = useERC20Token()

  const { address } = useAccount()

  const { data: walletClient } = useWalletClient()

  const publicClient = usePublicClient()

  const [token0Approved, setToken0Approved] = useState(true)
  const [token1Approved, setToken1Approved] = useState(true)

  useEffect(() => {
    if (!address || !token0Value || token0Value === '0' || !publicClient || pool.token0.id === WETH_ADDRESS) {
      setToken0Approved(true)
      return
    }
    const amount = parseUnits(token0Value, Number.parseInt(pool.token0.decimals))
    approved(address, pool.token0.id, amount, publicClient)
      .then(setToken0Approved)
      .catch((err) => console.error(err))
  }, [address, token0Value, pool.token0.id, pool.token0.decimals, publicClient, approved])

  useEffect(() => {
    if (!address || !token1Value || token1Value === '0' || !publicClient || pool.token1.id === WETH_ADDRESS) {
      setToken1Approved(true)
      return
    }
    const amount = parseUnits(token1Value, Number.parseInt(pool.token1.decimals))
    approved(address, pool.token1.id, amount, publicClient)
      .then(setToken1Approved)
      .catch((err) => console.error(err))
  }, [address, token1Value, pool.token1.id, pool.token1.decimals, publicClient, approved])

  const { calculateLiquidityCounterAmount, addLiquidity, addLiquidityETH } = useTayaSwapRouter()

  const handleToken0ValueChange = (value: string) => {
    const slippage = 1

    setLoadingToken1(true)
    setToken0Value(value)

    try {
      const inputAmount = parseUnits(value, Number.parseInt(pool.token0.decimals))

      const outputAmount = calculateLiquidityCounterAmount(inputAmount, pool.token0.id, pool, slippage)

      const formattedOutput = formatTokenBalance(outputAmount, Number.parseInt(pool.token1.decimals))

      setToken1Value(formattedOutput)
    } catch (error) {
      console.error('Error calculating trade output for token0:', error)
    }

    setLoadingToken1(false)
  }

  const handleToken1ValueChange = (value: string) => {
    const slippage = 1

    setLoadingToken0(true)
    setToken1Value(value)

    try {
      const inputAmount = parseUnits(value, Number.parseInt(pool.token1.decimals))

      const outputAmount = calculateLiquidityCounterAmount(inputAmount, pool.token1.id, pool, slippage)

      const formattedOutput = formatTokenBalance(outputAmount, Number.parseInt(pool.token0.decimals))

      setToken0Value(formattedOutput)
    } catch (error) {
      console.error('Error calculating trade output for token1:', error)
    }
    setLoadingToken0(false)
  }

  const [loadingApproveToken0, setLoadingApproveToken0] = useState(false)

  const handleApproveToken0 = async () => {
    if (!walletClient || !publicClient) return

    setLoadingApproveToken0(true)
    try {
      const amount = parseUnits(token0Value, Number.parseInt(pool.token0.decimals))

      await approve(pool.token0.id, amount, walletClient)
      if (address) {
        const amount = parseUnits(token0Value, Number.parseInt(pool.token0.decimals))
        const isApproved = await approved(address, pool.token0.id, amount, publicClient)
        setToken0Approved(isApproved)
      }
    } catch (err) {
      console.error('Error approving token0:', err)
    }
    setLoadingApproveToken0(false)
  }

  const [loadingApproveToken1, setLoadingApproveToken1] = useState(false)

  const handleApproveToken1 = async () => {
    if (!walletClient || !publicClient) return

    setLoadingApproveToken1(true)

    try {
      const amount = parseUnits(token1Value, Number.parseInt(pool.token1.decimals))

      await approve(pool.token1.id, amount, walletClient)
      if (address) {
        const amount = parseUnits(token1Value, Number.parseInt(pool.token1.decimals))
        const isApproved = await approved(address, pool.token1.id, amount, publicClient)
        setToken1Approved(isApproved)
      }
    } catch (err) {
      console.error('Error approving token1:', err)
    }

    setLoadingApproveToken1(false)
  }

  const token0Balance: bigint = tokenBalances[pool.token0.id]?.balance || 0n
  const token1Balance: bigint = tokenBalances[pool.token1.id]?.balance || 0n

  let token0ValueBigInt = 0n
  let token1ValueBigInt = 0n
  try {
    token0ValueBigInt = parseUnits(token0Value, Number.parseInt(pool.token0.decimals))
  } catch (error) {
    console.error('Error parsing token0 value', error)
  }
  try {
    token1ValueBigInt = parseUnits(token1Value, Number.parseInt(pool.token1.decimals))
  } catch (error) {
    console.error('Error parsing token1 value', error)
  }

  const hasSufficientToken0 = token0ValueBigInt <= token0Balance
  const hasSufficientToken1 = token1ValueBigInt <= token1Balance

  const canAddLiquidity =
    token0Value !== '0' &&
    token1Value !== '0' &&
    token0Approved &&
    token1Approved &&
    hasSufficientToken0 &&
    hasSufficientToken1

  const [loadingAddLiquidity, setLoadingAddLiquidity] = useState(false)

  const handleAddLiquidity = () => {
    if (!walletClient) return
    setLoadingAddLiquidity(true)
    setLoadingAddLiquidity(false)
  }

  return (
    <motion.div
      key="addLiquidity"
      custom={direction}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', width: '100%' }}
    >
      <VStack width="full" gap="15px" mt="20px">
        <HStack width="full" position="relative">
          <Box
            onClick={() => handleToken0ValueChange(getFormattedTokenBalance(pool.token0.id))}
            position="absolute"
            cursor="pointer"
            top="-25px"
            right="0"
            zIndex="30"
          >
            <Text fontSize="xs" color="text-contrast">
              Available: {getFormattedTokenBalance(pool.token0.id)}
            </Text>
          </Box>

          <TokenAmountInput
            loading={loadingToken0}
            value={token0Value}
            tokenSymbol={pool.token0.symbol}
            tokenAddress={pool.token0.id}
            onChangeHandler={(value) => handleToken0ValueChange(value)}
          />
        </HStack>
        <HStack width="full" justifyContent="center">
          <IconButton
            variant="ghost"
            size="lg"
            cursor="default"
            rounded="full"
            background="modal-selector-button-background"
          >
            <PlusIcon />
          </IconButton>
        </HStack>

        <HStack width="full" position="relative">
          <Box
            onClick={() => handleToken1ValueChange(getFormattedTokenBalance(pool.token1.id))}
            position="absolute"
            cursor="pointer"
            top="-25px"
            right="0"
            zIndex="30"
          >
            <Text fontSize="xs" color="text-contrast">
              Available: {getFormattedTokenBalance(pool.token1.id)}
            </Text>
          </Box>
          <TokenAmountInput
            loading={loadingToken1}
            value={token1Value}
            tokenSymbol={pool.token1.symbol}
            tokenAddress={pool.token1.id}
            onChangeHandler={(value) => handleToken1ValueChange(value)}
          />
        </HStack>

        {(!hasSufficientToken0 || !hasSufficientToken1) && (
          <VStack>
            {!hasSufficientToken0 && (
              <Text color="red.500" fontSize="sm">
                Not enough {pool.token0.symbol} balance.
              </Text>
            )}
            {!hasSufficientToken1 && (
              <Text color="red.500" fontSize="sm">
                Not enough {pool.token1.symbol} balance.
              </Text>
            )}
          </VStack>
        )}

        {token1Approved && token0Approved && (
          <Box width="full" mt="20px">
            <SubmitButton
              width="full"
              loading={loadingAddLiquidity}
              text="Add Liquidity"
              onClickHandler={handleAddLiquidity}
              disabled={!canAddLiquidity}
            />
          </Box>
        )}

        <VStack width="full" gap="3px">
          {!token0Approved && hasSufficientToken0 && (
            <SubmitButton
              width="full"
              disabled={false}
              loading={loadingApproveToken0}
              text={`Approve ${pool.token0.symbol}`}
              onClickHandler={handleApproveToken0}
            />
          )}

          {!token1Approved && hasSufficientToken1 && (
            <SubmitButton
              width="full"
              disabled={false}
              loading={loadingApproveToken1}
              text={`Approve ${pool.token1.symbol}`}
              onClickHandler={handleApproveToken1}
            />
          )}
        </VStack>
      </VStack>
    </motion.div>
  )
}

function RemoveLiquidityView({ direction, pool }: IViewProps) {
  const { address, chainId } = useAccount()

  const { poolBalances, getFormattedPoolBalance } = useTokenBalancesStore()

  const [withdrawValue, setWithdrawValue] = useState(50)

  const { amountToken0, amountToken1 } = calculateWithdrawAmounts(
    getFormattedPoolBalance(pool.id),
    pool.totalSupply,
    { reserve: pool.reserve0, decimals: pool.token0.decimals },
    { reserve: pool.reserve1, decimals: pool.token1.decimals }
  )

  const handleSliderChange = (value: number) => setWithdrawValue(value)

  const amount0Withdraw = useMemo(() => {
    const token0Balance = parseUnits(amountToken0, Number.parseInt(pool.token0.decimals))
    return (token0Balance * BigInt(withdrawValue)) / 100n
  }, [amountToken0, pool.token0.decimals, withdrawValue])

  const amount1Withdraw = useMemo(() => {
    const token1Balance = parseUnits(amountToken1, Number.parseInt(pool.token1.decimals))
    return (token1Balance * BigInt(withdrawValue)) / 100n
  }, [amountToken1, pool.token1.decimals, withdrawValue])

  const poolBalanceWithdraw = useMemo(() => {
    return (poolBalances[pool.id].balance * BigInt(withdrawValue)) / 100n
  }, [poolBalances, withdrawValue, pool.id])

  const [loadingWithdrawal, setLoadingWithdrawal] = useState(false)
  const [signature, setSignature] = useState<
    { v: bigint | undefined; r: `0x${string}`; s: `0x${string}`; deadline: bigint } | undefined
  >(undefined)

  const { data: walletClient } = useWalletClient()

  const { getPermitSignature } = usePermitSignature({ chainId, pool, owner: address })

  const { removeLiquidityWithPermit, removeLiquidityETHWithPermit } = useTayaSwapRouter()

  const handleWithdraw = async () => {
    const slippage = 5
    if (!address || !walletClient || !signature || !signature.v) return

    setLoadingWithdrawal(true)

    try {
      if (pool.token0.id === WETH_ADDRESS || pool.token1.id === WETH_ADDRESS) {
        const token = pool.token0.id === WETH_ADDRESS ? pool.token1 : pool.token0

        await removeLiquidityETHWithPermit(
          token,
          poolBalanceWithdraw,
          slippage,
          address,
          walletClient,
          pool,
          signature.v,
          signature.r,
          signature.s,
          signature.deadline
        )
      } else {
        await removeLiquidityWithPermit(
          pool.token0,
          pool.token1,
          poolBalanceWithdraw,
          slippage,
          address,
          walletClient,
          pool,
          signature.v,
          signature.r,
          signature.s,
          signature.deadline
        )
      }
    } catch (e) {
      console.error('Withdrawal error:', e)
    }

    setLoadingWithdrawal(false)
    close()
  }

  const handleSign = async () => {
    if (!walletClient || !chainId || !address) return

    setLoadingWithdrawal(true)

    try {
      const signature = await getPermitSignature(chainId, pool, {
        owner: address,
        spender: ROUTER_ADDRESS,
        value: poolBalanceWithdraw
      })

      setSignature(signature)
    } catch (e) {
      console.error('Signature error:', e)
    }

    setLoadingWithdrawal(false)
  }

  return (
    <motion.div
      key="removeLiquidity"
      custom={direction}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', width: '100%' }}
    >
      <VStack width="full" gap="10px">
        <HStack justifyContent="space-between" width="full" px="5">
          <Text fontSize="14px" fontWeight="400">
            Your position
          </Text>
          <HStack alignItems="center">
            <TokenIconGroup token0={pool.token0.id} token1={pool.token1.id} size="25px" />
            <Text fontSize="xs" fontWeight="400">
              {pool.token0.symbol}/{pool.token1.symbol}
            </Text>
          </HStack>
        </HStack>
        <HStack
          background="modal-selector-button-background"
          height="100px"
          width="full"
          borderRadius="10px"
          px="5"
          justifyContent="space-between"
        >
          <VStack>
            <Text>{pool.token0.symbol}</Text>
            <Text color="custom-green">{amountToken0}</Text>
          </VStack>
          <VStack>
            <Text>{pool.token1.symbol}</Text>
            <Text color="custom-green">{amountToken1}</Text>
          </VStack>
          <VStack>
            <Text>Pool Tokens</Text>
            <Text color="custom-green">{getFormattedPoolBalance(pool.id)}</Text>
          </VStack>
        </HStack>
        <HStack justifyContent="space-between" width="full" px="5">
          <Text fontSize="14px" fontWeight="400">
            Withdraw Amount
          </Text>
        </HStack>
        <HStack justifyContent="start" width="full" px="5">
          <Text fontSize="20px" fontWeight="600" color="text-contrast">
            {withdrawValue}%
          </Text>
        </HStack>
        <Box width="full">
          <Slider value={withdrawValue} onChange={handleSliderChange} />
        </Box>
        <HStack justifyContent="space-between" alignItems="center" width="full" px="5">
          <ActionButton
            text="25%"
            rounded="full"
            height="25px"
            width="60px"
            size="xs"
            onClickHandler={() => setWithdrawValue(25)}
          />
          <ActionButton
            text="50%"
            rounded="full"
            height="25px"
            width="60px"
            size="xs"
            onClickHandler={() => setWithdrawValue(50)}
          />
          <ActionButton
            text="75%"
            rounded="full"
            height="25px"
            width="60px"
            size="xs"
            onClickHandler={() => setWithdrawValue(75)}
          />
          <ActionButton
            text="100%"
            rounded="full"
            height="25px"
            width="60px"
            size="xs"
            onClickHandler={() => setWithdrawValue(100)}
          />
        </HStack>
        <Box width="full" mt="5">
          <SubmitButton
            onClickHandler={signature ? handleWithdraw : handleSign}
            text={signature ? 'Withdraw' : 'Sign'}
            loading={loadingWithdrawal}
            disabled={amount0Withdraw === 0n || amount1Withdraw === 0n}
            width="full"
            px="5"
          />
        </Box>
      </VStack>
    </motion.div>
  )
}

export interface IManagePoolModalProps {
  pool: IPairData
  open: boolean
  onClose: () => void
  close: () => void
}

export function ManagePoolModal({ pool, open, onClose, close }: IManagePoolModalProps) {
  const [view, setView] = useState(View.Selector)

  const [direction, setDirection] = useState(0)

  const changeView = (newView: View) => {
    setDirection(newView > view ? 1 : -1)
    setView(newView)
  }

  return (
    <Box position="absolute" width={{ base: 'full', lg: 'calc(100vw - 600px)' }} px="5" height="100vh">
      <Center height="calc(100vh - 400px)">
        <DialogRoot open={open} size="xs" motionPreset="scale" onExitComplete={onClose}>
          <DialogBackdrop />
          <DialogContent rounded="25px" background="modal-background" border="1px solid" borderColor="modal-border">
            <DialogCloseTrigger />
            <DialogHeader>
              <HStack justifyContent="space-between">
                <HStack justifyContent="start" alignItems="center" gap="15px">
                  {(view === View.AddLiquidity || view === View.RemoveLiquidity) && (
                    <IconButton
                      onClick={() => changeView(View.Selector)}
                      variant="ghost"
                      size="xs"
                      rounded="full"
                      _hover={{ background: 'button-group-button-background' }}
                      background="modal-selector-button-background"
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  )}
                  <DialogTitle>
                    <Text color="text-contrast" fontWeight="400">
                      {view === View.Selector && 'Manage Pool'}
                      {view === View.AddLiquidity && 'Add Liquidity'}
                      {view === View.RemoveLiquidity && 'Remove Liquidity'}
                    </Text>
                  </DialogTitle>
                </HStack>
                <IconButton
                  onClick={close}
                  variant="ghost"
                  size="xs"
                  rounded="full"
                  _hover={{ background: 'button-group-button-background' }}
                  background="modal-selector-button-background"
                >
                  <CloseIcon />
                </IconButton>
              </HStack>
            </DialogHeader>
            <DialogBody>
              <Box height="350px" position="relative" overflow="hidden">
                <AnimatePresence initial={false} custom={direction}>
                  {view === View.Selector && (
                    <SelectActionView direction={direction} changeView={changeView} pool={pool} />
                  )}

                  {view === View.AddLiquidity && (
                    <AddLiquidityView direction={direction} changeView={changeView} pool={pool} />
                  )}

                  {view === View.RemoveLiquidity && (
                    <RemoveLiquidityView direction={direction} changeView={changeView} pool={pool} />
                  )}
                </AnimatePresence>
              </Box>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </Center>
    </Box>
  )
}
