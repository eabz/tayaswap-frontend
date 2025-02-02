import { type HTMLChakraProps, chakra } from '@chakra-ui/react'

export function DashboardIcon(props: HTMLChakraProps<'svg'>) {
  return (
    <chakra.svg
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeWidth="2"
      strokeLinejoin="round"
      {...props}
    >
      <title>DashboardIcon</title>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </chakra.svg>
  )
}
