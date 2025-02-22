import { TokenListProvider } from './TokenList'

export async function StateProvider({ children }: { children: React.ReactNode }) {
  return <TokenListProvider>{children}</TokenListProvider>
}
