import { Input as ChakraInput, InputGroup } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface IInputProps {
  placeholder: string
  onChange: () => void
  iconPosition: 'start' | 'end'
  icon: ReactNode
}

export function Input({ placeholder, onChange, iconPosition = 'start' }: IInputProps) {
  return (
    <InputGroup flex="1" startElement={<LuUser />}>
      <ChakraInput placeholder={placeholder} onChange={onChange} rounded="full" />
    </InputGroup>
  )
}
