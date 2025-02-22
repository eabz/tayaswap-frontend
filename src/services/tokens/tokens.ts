import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

const TOKENS_LIST =
  'https://raw.githubusercontent.com/eabz/tayaswap-frontend/refs/heads/main/public/assets/tokenlist.json'

interface ITokenListToken {
  address: string
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

interface ITokenListResponse {
  name: string
  timestamp: string
  version: {
    major: number
    minor: number
    patch: number
  }
  logoURI: string
  keywords: string[]
  tokens: ITokenListToken[]
}

const getTokensList = async () => {
  const response = await fetch(TOKENS_LIST)

  const { tokens }: ITokenListResponse = await response.json()

  return tokens
}

export function useTokensList(config?: SWRConfiguration): {
  data: ITokenListToken[] | undefined
  loading: boolean
  error: boolean
} {
  const { data, isLoading: loading, error } = useSWR('tokens_list', () => getTokensList(), config)

  return { data, loading, error: error !== undefined }
}
