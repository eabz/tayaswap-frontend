import { type ITokenListToken, fetchBalances } from '@/services'
import { create } from 'zustand'
import {} from 'zustand/middleware'

interface ITokenBalancesStore {
  tokenBalances: { [k: string]: bigint }
  poolBalances: { [k: string]: bigint }
  reloadTokenBalances: (owner: string, tokens: ITokenListToken[]) => Promise<void>
  reloadPoolBalances: (owner: string, tokens: ITokenListToken[]) => Promise<void>
}

export const useTokenBalancesStore = create<ITokenBalancesStore>()((set, get) => ({
  tokenBalances: {},
  poolBalances: {},
  reloadTokenBalances: async (owner: string, tokens: ITokenListToken[]) => {
    await fetchBalances(owner, tokens, (batchBalances) => {
      set((state) => ({
        tokenBalances: { ...state.tokenBalances, ...batchBalances }
      }))
    })
  },
  reloadPoolBalances: async (owner: string, tokens: ITokenListToken[]) => {
    await fetchBalances(owner, tokens, (batchBalances) => {
      set((state) => ({
        poolBalances: { ...state.poolBalances, ...batchBalances }
      }))
    })
  }
}))
