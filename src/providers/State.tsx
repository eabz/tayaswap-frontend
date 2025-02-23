import { TokenBalancesProvider } from './Balances'
import { TokenListProvider } from './TokenList'

export async function StateProvider({ children }: { children: React.ReactNode }) {
  return (
    <TokenListProvider>
      <TokenBalancesProvider>{children}</TokenBalancesProvider>
    </TokenListProvider>
  )
}
