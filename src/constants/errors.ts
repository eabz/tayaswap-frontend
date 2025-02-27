export const ERROR_APPROVE = (token: string, amount: string, err: unknown) =>
  `Error approving token: ${token} for ${amount}: ${err}`

export const ERROR_CALCULATING_LIQUIDITY = (token0: string, token1: string, err: unknown) =>
  `Error calculating liquidity amounts for token0: ${token0} token1 ${token1}: ${err}`

export const ERROR_LIQUIDITY = (
  token0: string,
  token0Amount: string,
  token1: string,
  token1Amount: string,
  err: unknown
) =>
  `Error adding liquidity for token0: ${token0} amount ${token0Amount} token1 ${token1} amount ${token1Amount}: ${err}`

export const ERROR_CALCULATING_TRADE = (token0: string, token1: string, err: unknown) =>
  `Error calculating trade amounts for token0: ${token0} token1 ${token1}: ${err}`

export const ERROR_EVALUATING_ROUTE = (route: string[], err: unknown) => `Error evaluating route: ${route}: ${err}`

export const ERROR_WITHDRAWAL = (poolBalance: string, token0: string, token1: string, err: unknown) =>
  `Error withdrawing ${poolBalance} pool tokens for token0 ${token0} token1 ${token1} : ${err}`

export const ERROR_SIGNATURE = (err: unknown) => `Signature error: ${err}`
