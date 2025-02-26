import { WAGMI_CONFIG } from '@/providers'
import type { IPairData, IPairTokenData } from '@/services'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/utils'
import { type Account, type PublicClient, type WalletClient, parseUnits } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'

interface ITayaSwapRouter {
  calculateLiquidityCounterAmount: (inputAmount: bigint, inputToken: string, pool: IPairData) => bigint
  calculateTradeOutput: (inputAmount: bigint, path: string[], client: PublicClient) => Promise<bigint>
  removeLiquidityWithPermit: (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData,
    v: bigint,
    r: string,
    s: string,
    deadline: bigint
  ) => Promise<void>
  removeLiquidityETHWithPermit: (
    token: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData,
    v: bigint,
    r: string,
    s: string,
    deadline: bigint
  ) => Promise<void>
  addLiquidity: (
    token0: IPairTokenData,
    token1: IPairTokenData,
    amountADesired: bigint,
    amountBDesired: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    deadline: bigint
  ) => Promise<void>
  addLiquidityETH: (
    token: IPairTokenData,
    amountTokenDesired: bigint,
    amountETHDesired: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    deadline: bigint
  ) => Promise<void>
}

export function useTayaSwapRouter(): ITayaSwapRouter {
  const calculateLiquidityCounterAmount = (inputAmount: bigint, inputToken: string, pool: IPairData): bigint => {
    if (inputAmount === 0n) return 0n

    const reserve0 = parseUnits(pool.reserve0, Number(pool.token0.decimals))
    const reserve1 = parseUnits(pool.reserve1, Number(pool.token1.decimals))

    let idealCounter: bigint

    if (inputToken === pool.token0.id) {
      idealCounter = (inputAmount * reserve1 + reserve0 - 1n) / reserve0
    } else if (inputToken === pool.token1.id) {
      idealCounter = (inputAmount * reserve0 + reserve1 - 1n) / reserve1
    } else {
      throw new Error('Input token is not part of this pool')
    }

    return idealCounter
  }

  const removeLiquidityWithPermit = async (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData,
    v: bigint,
    r: string,
    s: string,
    deadline: bigint
  ): Promise<void> => {
    const totalSupply = parseUnits(pool.totalSupply, 18)
    const reserve0 = parseUnits(pool.reserve0, Number(pool.token0.decimals))
    const reserve1 = parseUnits(pool.reserve1, Number(pool.token1.decimals))

    const expectedAmount0 = (liquidity * reserve0) / totalSupply
    const expectedAmount1 = (liquidity * reserve1) / totalSupply

    const minAmount0 = (expectedAmount0 * BigInt(100 - slippage)) / 100n
    const minAmount1 = (expectedAmount1 * BigInt(100 - slippage)) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'removeLiquidityWithPermit',
      args: [token0.id, token1.id, liquidity, minAmount0, minAmount1, toAddress, deadline, false, v, r, s],
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  const removeLiquidityETHWithPermit = async (
    token: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData,
    v: bigint,
    r: string,
    s: string,
    deadline: bigint
  ): Promise<void> => {
    const totalSupply = parseUnits(pool.totalSupply, 18)
    const reserve0 = parseUnits(pool.reserve0, Number(pool.token0.decimals))
    const reserve1 = parseUnits(pool.reserve1, Number(pool.token1.decimals))

    let expectedTokenAmount: bigint
    let expectedETHAmount: bigint

    if (token.id === pool.token0.id) {
      expectedTokenAmount = (liquidity * reserve0) / totalSupply
      expectedETHAmount = (liquidity * reserve1) / totalSupply
    } else if (token.id === pool.token1.id) {
      expectedTokenAmount = (liquidity * reserve1) / totalSupply
      expectedETHAmount = (liquidity * reserve0) / totalSupply
    } else {
      throw new Error('Token is not part of this pool')
    }

    const minTokenAmount = (expectedTokenAmount * BigInt(100 - slippage)) / 100n
    const minETHAmount = (expectedETHAmount * BigInt(100 - slippage)) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'removeLiquidityETHWithPermit',
      args: [token.id, liquidity, minTokenAmount, minETHAmount, toAddress, deadline, false, v, r, s],
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  async function calculateTradeOutput(inputAmount: bigint, path: string[], client: PublicClient): Promise<bigint> {
    if (inputAmount === 0n) return 0n

    const amounts = await client.readContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'getAmountsOut',
      args: [inputAmount, path]
    })

    const length = (amounts as bigint[]).length

    return (amounts as bigint[])[length - 1]
  }

  const addLiquidity = async (
    token0: IPairTokenData,
    token1: IPairTokenData,
    amountADesired: bigint,
    amountBDesired: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    deadline: bigint
  ): Promise<void> => {
    const minAmountA = (amountADesired * BigInt(100 - slippage)) / 100n
    const minAmountB = (amountBDesired * BigInt(100 - slippage)) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'addLiquidity',
      args: [token0.id, token1.id, amountADesired, amountBDesired, minAmountA, minAmountB, toAddress, deadline],
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  const addLiquidityETH = async (
    token: IPairTokenData,
    amountTokenDesired: bigint,
    amountETHDesired: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    deadline: bigint
  ): Promise<void> => {
    const minTokenAmount = (amountTokenDesired * BigInt(100 - slippage)) / 100n
    const minETHAmount = (amountETHDesired * BigInt(100 - slippage)) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'addLiquidityETH',
      args: [token.id, amountTokenDesired, minTokenAmount, minETHAmount, toAddress, deadline],
      chain: client.chain,
      account: client.account as Account,
      value: amountETHDesired
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  return {
    calculateLiquidityCounterAmount,
    removeLiquidityWithPermit,
    removeLiquidityETHWithPermit,
    calculateTradeOutput,
    addLiquidity,
    addLiquidityETH
  }
}
