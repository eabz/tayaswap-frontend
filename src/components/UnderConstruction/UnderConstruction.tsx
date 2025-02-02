import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'

export const UnderConstruction = () => {
  return (
    <Box height="full" width="md" mx="auto">
      <VStack width="full">
        <HStack width="full" justifyContent="center" pt="20">
          <Image src="/under-construction.png" loading="lazy" width={250} height={213} alt="logo-taya-swap" />
        </HStack>
        <Heading justifyContent="center" py="5">
          🚧 Under Construction
        </Heading>
      </VStack>

      <Text textAlign="center">
        We're hard at work building something amazing for you! Stay tuned as we put the finishing touches on a new
        experience. It won't be long before this space is ready to explore. Check back soon, or follow us to be the
        first to know when we're live!
      </Text>
    </Box>
  )
}

export default UnderConstruction
