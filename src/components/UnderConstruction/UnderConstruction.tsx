import { Box, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'

const UnderConstruction = () => {
  return (
    <Box>
      <Image src="/under=construction.png" loading="lazy" width={500} height={426} alt="logo-taya-swap" />
      <Heading>🚧 Under Construction</Heading>
      <Text className="w-full max-w-[500px] text-center mt-5">
        We're hard at work building something amazing for you! Stay tuned as we put the finishing touches on a new
        experience. It won't be long before this space is ready to explore. Check back soon, or follow us to be the
        first to know when we're live!
      </Text>
    </Box>
  )
}

export default UnderConstruction
