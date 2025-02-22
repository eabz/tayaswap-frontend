'use client'

import { useMobile } from '@/hooks'
import { Box } from '@chakra-ui/react'

export default function Page() {
  const { mobile } = useMobile()

  return (
    <main>
      <Box
        background="background"
        h="full"
        position="absolute"
        top="0"
        ml={mobile ? '0px' : '100px'}
        mt="80px"
        width="full"
      />
    </main>
  )
}
