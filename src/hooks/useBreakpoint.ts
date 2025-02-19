import { useBreakpointValue } from '@chakra-ui/react'

export const useBreakpoint = (): { mobile: boolean } => {
  const breakpoint = useBreakpointValue({
    base: 'base',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl'
  })

  console.log(breakpoint)

  return { mobile: breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'xs' || breakpoint === 'base' }
}
