import { create } from 'zustand'
import {} from 'zustand/middleware'

interface ITokenBalancesStore {
  tokenBalances: { [k: string]: bigint }
  poolBalances: { [k: string]: bigint }
}

export const useTokenBalancesStore = create<ITokenBalancesStore>()((set, get) => ({
  tokenBalances: {},
  poolBalances: {}
}))
