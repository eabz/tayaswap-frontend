import { fetchBalances } from '@/services'
import { create } from 'zustand'
import {} from 'zustand/middleware'

interface ITokenBalancesStore {
  tokenBalances: { [k: string]: bigint }
  poolBalances: { [k: string]: bigint }
  reloadTokenBalances: (owner: string, tokens: string[]) => Promise<void>
  reloadPoolBalances: (owner: string, tokens: string[]) => Promise<void>
}

const reload = (
  key: 'tokenBalances' | 'poolBalances',
  set: (fn: (state: ITokenBalancesStore) => Partial<ITokenBalancesStore>) => void
) => {
  return async (owner: string, tokens: string[]) => {
    await fetchBalances(owner, tokens, (batchBalances) => {
      set((state: ITokenBalancesStore) => ({
        [key]: { ...state[key], ...batchBalances }
      }))
    })
  }
}

export const useTokenBalancesStore = create<ITokenBalancesStore>((set) => ({
  tokenBalances: {},
  poolBalances: {},
  reloadTokenBalances: reload('tokenBalances', set),
  reloadPoolBalances: reload('poolBalances', set)
}))
