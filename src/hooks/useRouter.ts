import { WAGMI_CONFIG } from '@/providers'
import type { IPairData, IPairTokenData } from '@/services'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/utils'
import { type Account, type WalletClient, parseUnits } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'

interface ITayaSwapRouter {
  calculateLiquidityCounterAmount: (
    inputAmount: bigint,
    inputToken: string,
    pool: IPairData,
    slippage: number
  ) => bigint
  removeLiquidity: (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData
  ) => Promise<void>
  removeLiquidityETHWithPermit: (
    token: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData,
    approveMax: boolean,
    v: bigint,
    r: string,
    s: string
  ) => Promise<void>
}

// TODO: find a way to fix this lint exception
// biome-ignore lint/style/useNamingConvention: hooks must be constants
export const useTayaSwapRouter = (): ITayaSwapRouter => {
  const calculateLiquidityCounterAmount = (
    inputAmount: bigint,
    inputToken: string,
    pool: IPairData,
    slippage: number
  ): bigint => {
    if (inputAmount === 0n) return 0n

    const reserve0 = parseUnits(pool.reserve0, 18)
    const reserve1 = parseUnits(pool.reserve1, 18)

    let requiredCounter: bigint

    if (inputToken === pool.token0.id) {
      requiredCounter = (inputAmount * reserve1) / reserve0
    } else if (inputToken === pool.token1.id) {
      requiredCounter = (inputAmount * reserve0) / reserve1
    } else {
      throw new Error('Input token is not part of this pool')
    }

    const minRequired = (requiredCounter * (100n - BigInt(slippage))) / 100n

    return minRequired
  }

  const removeLiquidity = async (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
    slippage: number,
    toAddress: string,
    client: WalletClient,
    pool: IPairData
  ): Promise<void> => {
    const totalSupply = parseUnits(pool.totalSupply, 18)
    const reserve0 = parseUnits(pool.reserve0, Number.parseInt(pool.token0.decimals))
    const reserve1 = parseUnits(pool.reserve1, Number.parseInt(pool.token1.decimals))

    const expectedAmount0 = (liquidity * reserve0) / totalSupply
    const expectedAmount1 = (liquidity * reserve1) / totalSupply

    const minAmount0 = (expectedAmount0 * BigInt(100 - slippage)) / 100n
    const minAmount1 = (expectedAmount1 * BigInt(100 - slippage)) / 100n

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60)

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'removeLiquidity',
      args: [token0.id, token1.id, liquidity, minAmount0, minAmount1, toAddress, deadline],
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
    approveMax: boolean,
    v: bigint,
    r: string,
    s: string
  ): Promise<void> => {
    const totalSupply = parseUnits(pool.totalSupply, 18)
    const reserve0 = parseUnits(pool.reserve0, Number.parseInt(pool.token0.decimals))
    const reserve1 = parseUnits(pool.reserve1, Number.parseInt(pool.token1.decimals))

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

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60)

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'removeLiquidityETHWithPermit',
      args: [token.id, liquidity, minTokenAmount, minETHAmount, toAddress, deadline, approveMax, v, r, s],
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  return {
    calculateLiquidityCounterAmount,
    removeLiquidity,
    removeLiquidityETHWithPermit
  }
}
