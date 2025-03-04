import type { IPairData } from '@/services'
import { parseUnits } from 'viem'

export function calculateMinAmountsForAddLiquidity(
  amountA: bigint,
  amountB: bigint,
  slippageTolerance: number
): { minAmountA: bigint; minAmountB: bigint } {
  const bips = BigInt(10000)

  const toleranceBips = BigInt(Math.floor(slippageTolerance * 10000))

  const minAmountA = (amountA * (bips - toleranceBips)) / bips

  const minAmountB = (amountB * (bips - toleranceBips)) / bips

  return { minAmountA, minAmountB }
}

export function calculateMinAmountsForRemoveLiquidity(
  liquidity: bigint,
  pool: IPairData,
  slippageTolerance: number
): { minAmountA: bigint; minAmountB: bigint } {
  const reserve0 = parseUnits(pool.reserve0, Number(pool.token0.decimals))

  const reserve1 = parseUnits(pool.reserve1, Number(pool.token1.decimals))

  const totalSupply = parseUnits(pool.totalSupply, 18)

  const expectedAmountA = (liquidity * reserve0) / totalSupply
  const expectedAmountB = (liquidity * reserve1) / totalSupply

  return calculateMinAmountsForAddLiquidity(expectedAmountA, expectedAmountB, slippageTolerance)
}
