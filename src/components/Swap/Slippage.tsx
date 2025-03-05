'use client'

import { ERROR_PARSE_FLOAT } from '@/constants'
import { useSlippage } from '@/stores'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { ActionButton } from '../Buttons'
import { Input } from '../Input'

export function Slippage() {
  const { slippage, setSlippage } = useSlippage()

  const handleSlippageChange = (value: string) => {
    try {
      const parsed = Number.parseFloat(value)
      setSlippage(parsed)
    } catch (err) {
      console.error(ERROR_PARSE_FLOAT(err))
    }
  }

  return (
    <VStack width="full" alignItems="start">
      <Text color="text-contrast">Slippage %</Text>
      <HStack width="full" justifyContent="space-between" alignItems="center">
        <Input
          height="25px"
          textAlign="center"
          placeholder="Custom"
          background="accent-button-background"
          color="accent-button-color"
          border="1px solid"
          borderColor="custom-blue"
          type="number"
          onChangeHandler={handleSlippageChange}
          value={slippage}
        />
        <ActionButton
          text="0.05"
          rounded="full"
          fontSize="12px"
          height="20px"
          width="50px"
          size="xs"
          onClickHandler={() => handleSlippageChange('0.05')}
        />
        <ActionButton
          text="0.1"
          rounded="full"
          fontSize="12px"
          height="20px"
          width="50px"
          size="xs"
          onClickHandler={() => handleSlippageChange('0.1')}
        />
        <ActionButton
          text="0.5"
          rounded="full"
          fontSize="12px"
          height="20px"
          width="50px"
          size="xs"
          onClickHandler={() => handleSlippageChange('0.5')}
        />
        <ActionButton
          text="1"
          rounded="full"
          fontSize="12px"
          height="20px"
          width="50px"
          size="xs"
          onClickHandler={() => handleSlippageChange('1')}
        />
      </HStack>
    </VStack>
  )
}
