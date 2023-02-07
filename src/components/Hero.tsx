import { Flex, Heading } from '@chakra-ui/react'

export const Hero = ({ title = 'QR PETS' }: { title?: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
  >
    <Heading fontSize="6vw">{title}</Heading>
  </Flex>
)
