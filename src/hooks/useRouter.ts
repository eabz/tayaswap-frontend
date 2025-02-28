import { ERROR_TOKEN_POOL, ROUTER_ADDRESS } from '@/constants'
import { WAGMI_CONFIG } from '@/providers'
import type { IPairData, IPairTokenData } from '@/services'
import { ROUTER_ABI } from '@/utils'
import { type Account, type WalletClient, parseUnits } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'

interface ITayaSwapRouter {
  calculateLiquidityCounterAmount: (inputAmount: bigint, inputToken: string, pool: IPairData) => bigint
  removeLiquidityWithPermit: (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
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
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ) => Promise<void>
  addLiquidityETH: (
    token: IPairTokenData,
    amountTokenDesired: bigint,
    amountETHDesired: bigint,
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ) => Promise<void>
  swapExactTokensForTokens: (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ) => Promise<void>
  swapExactETHForTokens: (
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    ethAmount: bigint,
    pools: IPairData[]
  ) => Promise<void>
  swapExactTokensForETH: (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ) => Promise<void>
}

export function poolImpact(inputAmount: bigint, inputToken: string, pool: IPairData): number {
  if (inputAmount === 0n) return 0

  const reserve0 = parseUnits(pool.reserve0, Number(pool.token0.decimals))
  const reserve1 = parseUnits(pool.reserve1, Number(pool.token1.decimals))

  let reserveIn: bigint
  let reserveOut: bigint

  if (inputToken.toLowerCase() === pool.token0.id.toLowerCase()) {
    reserveIn = reserve0
    reserveOut = reserve1
  } else if (inputToken.toLowerCase() === pool.token1.id.toLowerCase()) {
    reserveIn = reserve1
    reserveOut = reserve0
  } else {
    throw new Error(ERROR_TOKEN_POOL(inputToken, pool.id))
  }

  const amountInWithFee = inputAmount * 997n

  const numerator = amountInWithFee * reserveOut

  const denominator = reserveIn * 1000n + amountInWithFee

  const amountOut = numerator / denominator

  const exactQuote = (inputAmount * reserveOut) / reserveIn

  const impact = ((exactQuote - amountOut) * 10000n) / exactQuote

  return Number(impact) / 100
}

export async function findBestRoute(
  inputAmount: bigint,
  tokenIn: string,
  tokenOut: string,
  pools: IPairData[]
): Promise<{ route: string[]; output: bigint }> {
  if (inputAmount === 0n) return { route: [], output: 0n }

  function existsPool(tokenA: string, tokenB: string): boolean {
    for (let i = 0; i < pools.length; i++) {
      const p = pools[i]
      if (
        (p.token0.id.toLowerCase() === tokenA.toLowerCase() && p.token1.id.toLowerCase() === tokenB.toLowerCase()) ||
        (p.token0.id.toLowerCase() === tokenB.toLowerCase() && p.token1.id.toLowerCase() === tokenA.toLowerCase())
      ) {
        return true
      }
    }
    return false
  }

  const routes: string[][] = []

  if (existsPool(tokenIn, tokenOut)) {
    routes.push([tokenIn, tokenOut])
  }

  const candidateSet = new Set<string>()
  for (let i = 0; i < pools.length; i++) {
    candidateSet.add(pools[i].token0.id)
    candidateSet.add(pools[i].token1.id)
  }
  candidateSet.delete(tokenIn)
  candidateSet.delete(tokenOut)

  const candidates = Array.from(candidateSet)

  for (let i = 0; i < candidates.length; i++) {
    const x = candidates[i]
    if (existsPool(tokenIn, x) && existsPool(x, tokenOut)) {
      routes.push([tokenIn, x, tokenOut])
    }
  }

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const x = candidates[i]
      const y = candidates[j]
      if (existsPool(tokenIn, x) && existsPool(x, y) && existsPool(y, tokenOut)) {
        routes.push([tokenIn, x, y, tokenOut])
      }
      if (existsPool(tokenIn, y) && existsPool(y, x) && existsPool(x, tokenOut)) {
        routes.push([tokenIn, y, x, tokenOut])
      }
    }
  }

  function getPool(tokenA: string, tokenB: string, pools: IPairData[]): IPairData | undefined {
    return pools.find(
      (p) =>
        (p.token0.id.toLowerCase() === tokenA.toLowerCase() && p.token1.id.toLowerCase() === tokenB.toLowerCase()) ||
        (p.token0.id.toLowerCase() === tokenB.toLowerCase() && p.token1.id.toLowerCase() === tokenA.toLowerCase())
    )
  }

  function getAmountOutLocal(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
    const amountInWithFee = amountIn * 997n

    const numerator = amountInWithFee * reserveOut

    const denominator = reserveIn * 1000n + amountInWithFee

    return numerator / denominator
  }

  let bestRoute: string[] = []
  let bestOutput = 0n

  for (const route of routes) {
    let amount = inputAmount

    let valid = true

    for (let i = 0; i < route.length - 1; i++) {
      const tokenA = route[i]

      const tokenB = route[i + 1]

      const pool = getPool(tokenA, tokenB, pools)

      if (!pool) {
        valid = false
        break
      }

      let reserveIn: bigint
      let reserveOut: bigint

      if (pool.token0.id.toLowerCase() === tokenA.toLowerCase()) {
        reserveIn = parseUnits(pool.reserve0, Number(pool.token0.decimals))
        reserveOut = parseUnits(pool.reserve1, Number(pool.token1.decimals))
      } else {
        reserveIn = parseUnits(pool.reserve1, Number(pool.token1.decimals))
        reserveOut = parseUnits(pool.reserve0, Number(pool.token0.decimals))
      }

      amount = getAmountOutLocal(amount, reserveIn, reserveOut)
    }

    if (!valid) continue

    if (amount > bestOutput) {
      bestOutput = amount
      bestRoute = route
    }
  }

  const minOutput = (bestOutput * BigInt(100 - slippage)) / 100n

  return { route: bestRoute, output: minOutput }
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
      throw new Error(ERROR_TOKEN_POOL(inputToken, pool.id))
    }

    return idealCounter
  }

  const removeLiquidityWithPermit = async (
    token0: IPairTokenData,
    token1: IPairTokenData,
    liquidity: bigint,
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
      throw new Error(ERROR_TOKEN_POOL(token.id, pool.id))
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

  const addLiquidity = async (
    token0: IPairTokenData,
    token1: IPairTokenData,
    amountADesired: bigint,
    amountBDesired: bigint,
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ): Promise<void> => {
    const pool = getPool(token0.id, token1.id, pools)
    if (!pool) throw new Error(ERROR_TOKEN_POOL(token0.id, token1.id))

    const impactA = poolImpact(amountADesired, token0.id, pool)
    const impactB = poolImpact(amountBDesired, token1.id, pool)
    const slippage = calculateSlippageWithImpact(Math.max(impactA, impactB))

    const minAmountA = (amountADesired * BigInt(100 - Math.round(slippage * 100))) / 100n
    const minAmountB = (amountBDesired * BigInt(100 - Math.round(slippage * 100))) / 100n

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
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ): Promise<void> => {
    const pool = getPool(token.id, path[path.length - 1], pools) // ETH is always the last token in the path
    if (!pool) throw new Error(ERROR_TOKEN_POOL(token.id, path[path.length - 1]))

    const impactToken = poolImpact(amountTokenDesired, token.id, pool)
    const impactETH = poolImpact(amountETHDesired, path[path.length - 1], pool)
    const slippage = calculateSlippageWithImpact(Math.max(impactToken, impactETH))

    const minTokenAmount = (amountTokenDesired * BigInt(100 - Math.round(slippage * 100))) / 100n
    const minETHAmount = (amountETHDesired * BigInt(100 - Math.round(slippage * 100))) / 100n

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

  const swapExactTokensForTokens = async (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ): Promise<void> => {
    // For multi-hop trades, calculate cumulative impact
    let totalImpact = 0
    for (let i = 0; i < path.length - 1; i++) {
      const pool = getPool(path[i], path[i + 1], pools)
      if (!pool) throw new Error(ERROR_TOKEN_POOL(path[i], path[i + 1]))
      totalImpact += poolImpact(i === 0 ? amountIn : amountOutMin, path[i], pool)
    }

    const slippage = calculateSlippageWithImpact(totalImpact)
    const minAmountOut = (amountOutMin * BigInt(100 - Math.round(slippage * 100))) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [amountIn, minAmountOut, path, toAddress, deadline],
      chain: client.chain,
      account: client.account as Account
    })
    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  const swapExactETHForTokens = async (
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    ethAmount: bigint,
    pools: IPairData[]
  ): Promise<void> => {
    // Calculate impact starting from ETH input
    let totalImpact = 0
    for (let i = 0; i < path.length - 1; i++) {
      const pool = getPool(path[i], path[i + 1], pools)
      if (!pool) throw new Error(ERROR_TOKEN_POOL(path[i], path[i + 1]))
      totalImpact += poolImpact(i === 0 ? ethAmount : amountOutMin, path[i], pool)
    }

    const slippage = calculateSlippageWithImpact(totalImpact)
    const minAmountOut = (amountOutMin * BigInt(100 - Math.round(slippage * 100))) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'swapExactETHForTokens',
      args: [minAmountOut, path, toAddress, deadline],
      chain: client.chain,
      account: client.account as Account,
      value: ethAmount
    })
    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  const swapExactTokensForETH = async (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    toAddress: string,
    client: WalletClient,
    deadline: bigint,
    pools: IPairData[]
  ): Promise<void> => {
    // Calculate impact for the path to ETH
    let totalImpact = 0
    for (let i = 0; i < path.length - 1; i++) {
      const pool = getPool(path[i], path[i + 1], pools)
      if (!pool) throw new Error(ERROR_TOKEN_POOL(path[i], path[i + 1]))
      totalImpact += poolImpact(i === 0 ? amountIn : amountOutMin, path[i], pool)
    }

    const slippage = calculateSlippageWithImpact(totalImpact)
    const minAmountOut = (amountOutMin * BigInt(100 - Math.round(slippage * 100))) / 100n

    const tx = await client.writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'swapExactTokensForETH',
      args: [amountIn, minAmountOut, path, toAddress, deadline],
      chain: client.chain,
      account: client.account as Account
    })
    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  return {
    calculatePoolImpact: poolImpact,
    calculateLiquidityCounterAmount,
    removeLiquidityWithPermit,
    removeLiquidityETHWithPermit,
    addLiquidity,
    addLiquidityETH,
    swapExactTokensForTokens,
    swapExactETHForTokens,
    swapExactTokensForETH
  }
}
