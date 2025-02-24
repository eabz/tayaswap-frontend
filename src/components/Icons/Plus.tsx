import { type HTMLChakraProps, chakra } from '@chakra-ui/react'

export function PlusIcon(props: HTMLChakraProps<'svg'>) {
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
      <title>PlusIcon</title>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </chakra.svg>
  )
}
