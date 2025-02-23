import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'
import { tayaswapSubpgrah } from './constants'
import { getPoolsQuery } from './queries'

export interface IPairTokenData {
  decimals: string
  id: string
  name: string
  symbol: string
}

interface IPairData {
  id: string
  reserve0: string
  reserve1: string
  token0: IPairTokenData
  token1: IPairTokenData
  totalSupply: string
  volumeUSD: string
  reserveUSD: string
}

interface IPoolsResponse {
  pairs: IPairData[]
}

const getPools = async () => {
  const { pairs } = (await tayaswapSubpgrah(getPoolsQuery, {})) as IPoolsResponse

  return pairs
}

export function usePools(config?: SWRConfiguration): {
  data: IPairData[] | undefined
  loading: boolean
  error: boolean
} {
  const { data, isLoading: loading, error } = useSWR('pools', () => getPools(), config)

  return { data, loading, error: error !== undefined }
}
