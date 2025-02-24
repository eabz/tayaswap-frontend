'use client'
import { Button, type ButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface IActionButton extends ButtonProps {
  icon?: ReactNode
  text: string
  onClickHandler: () => void
}

export function ActionButton({ text, icon, onClickHandler, ...props }: IActionButton) {
  return (
    <Button
      onClick={onClickHandler}
      {...props}
      variant="outline"
      height="45px"
      background="accent-button-background"
      color="accent-button-color"
      border="1px solid"
      fontSize="16px"
      borderColor="custom-blue"
      pr={icon ? 5 : 0}
      _hover={{ background: 'custom-blue', color: 'white' }}
    >
      {icon && icon} {text}
    </Button>
  )
}
