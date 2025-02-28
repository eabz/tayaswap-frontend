import { WETH_ADDRESS } from '@/constants'
import { WAGMI_CONFIG } from '@/providers'
import { WETH_ABI } from '@/utils'
import type { Account, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'

interface IWeth {
  wrap: (amountETH: bigint, client: WalletClient) => Promise<void>
  unwrap: (amountWETH: bigint, client: WalletClient) => Promise<void>
}
export function useWETH(): IWeth {
  const wrap = async (amountETH: bigint, client: WalletClient): Promise<void> => {
    const tx = await client.writeContract({
      address: WETH_ADDRESS,
      abi: WETH_ABI,
      functionName: 'deposit',
      args: [],
      value: amountETH,
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  const unwrap = async (amountWETH: bigint, client: WalletClient): Promise<void> => {
    const tx = await client.writeContract({
      address: WETH_ADDRESS,
      abi: WETH_ABI,
      functionName: 'withdraw',
      args: [amountWETH],
      chain: client.chain,
      account: client.account as Account
    })

    await waitForTransactionReceipt(WAGMI_CONFIG, { hash: tx })
  }

  return { wrap, unwrap }
}
