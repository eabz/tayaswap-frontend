import { Input as ChakraInput, HStack, type InputProps, Spinner } from '@chakra-ui/react'
import type { JSX } from 'react'

export interface ISwapTokenAmountInputProps extends InputProps {
  loading: boolean
  onChangeHandler: (value: string) => void
  inputValue: string
}

export function SwapTokenAmountInput({
  inputValue,
  onChangeHandler,
  loading
}: ISwapTokenAmountInputProps): JSX.Element {
  return loading ? (
    <HStack
      width="full"
      rounded="lg"
      background="input-liquidity-background"
      height="60px"
      alignItems="center"
      color="text-contrast"
      pl="20px"
      pr="110px"
    >
      <Spinner />
    </HStack>
  ) : (
    <ChakraInput
      height="60px"
      fontSize="xl"
      pl="20px"
      pr="20px"
      color="text-contrast"
      type="number"
      textAlign="left"
      background="input-liquidity-background"
      outline="none"
      border="none"
      placeholder="0.00"
      rounded="lg"
      value={inputValue}
      onChange={(v) => onChangeHandler(v.target.value)}
    />
  )
}
