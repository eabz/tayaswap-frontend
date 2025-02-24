import { PAIR_ABI } from '@/utils/abis/pair'
import { parseSignature } from 'viem'
import { useReadContract, useSignTypedData } from 'wagmi'

interface IPermitParams {
  owner: string
  spender: string
  value: bigint
}

export function usePermitSignature({
  chainId,
  tokenAddress,
  owner
}: { chainId: number | undefined; tokenAddress: string; owner: string | undefined }) {
  const { signTypedDataAsync } = useSignTypedData()

  const { data: nonce } = useReadContract({
    chainId,
    address: tokenAddress as `0x${string}`,
    abi: PAIR_ABI,
    functionName: 'nonces',
    args: [owner]
  })

  const getPermitSignature = async (
    chainId: number,
    tokenAddress: string,
    permit: IPermitParams
  ): Promise<{ v: bigint | undefined; r: `0x${string}`; s: `0x${string}` }> => {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 100_000)

    const signature = await signTypedDataAsync({
      domain: {
        name: 'Swap LP Token',
        version: '1',
        chainId: BigInt(chainId),
        verifyingContract: tokenAddress as `0x${string}`
      },
      types: {
        // biome-ignore lint/style/useNamingConvention: variables must match uppercase content
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        // biome-ignore lint/style/useNamingConvention: variables must match uppercase
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      },
      primaryType: 'Permit',
      message: {
        owner: permit.owner as `0x${string}`,
        spender: permit.spender as `0x${string}`,
        value: permit.value,
        nonce: nonce as bigint,
        deadline: deadline
      }
    })

    const { v, r, s } = parseSignature(signature)
    return { v, r, s }
  }

  return { getPermitSignature }
}
