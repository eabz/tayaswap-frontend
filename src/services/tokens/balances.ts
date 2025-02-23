import { wagmiConfig } from '@/providers'
import { ERC20_ABI, chunkArray } from '@/utils'
import { multicall } from 'wagmi/actions'
import type { ITokenListToken } from './list'

export const fetchBalances = async (
  owner: string,
  tokens: ITokenListToken[],
  onBatchComplete: (balances: { [address: string]: bigint }) => void
) => {
  const batchSize = 10

  const batches = chunkArray(tokens, batchSize)

  let aggregatedBalances: { [address: string]: bigint } = {}

  for (const batch of batches) {
    try {
      const batchBalances = await getMulticallBalances(owner, batch)
      aggregatedBalances = { ...aggregatedBalances, ...batchBalances }
      onBatchComplete(aggregatedBalances)
    } catch (error) {
      console.error('unable to fetch balance for batch', error)
    }
  }

  return aggregatedBalances
}

export const getMulticallBalances = async (owner: string, tokens: ITokenListToken[]) => {
  const contracts = tokens.map((token) => {
    return {
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [owner]
    }
  })

  const results = await multicall(wagmiConfig, { contracts })

  const balances = tokens.reduce(
    (acc, token, index) => {
      const balance: bigint = (results[index]?.result as bigint) ?? 0n
      acc[token.address] = balance
      return acc
    },
    {} as { [address: string]: bigint }
  )

  return balances
}
