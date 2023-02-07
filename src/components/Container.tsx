import { Flex, FlexProps, Container as ChakraContainer, ScaleFade } from '@chakra-ui/react'

export const Container = (props: FlexProps) => (
  <Flex
    direction="column"
    alignItems="center"
    justifyContent="flex-start"
    bg="gray.50"
    color="black"
    _dark={{
      bg: 'gray.900',
      color: 'white',
    }}
    {...props}
  >
    <ScaleFade initialScale={0.3} in={true}>
      <ChakraContainer
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      bg="gray.50"
      color="black"
      _dark={{
        bg: 'gray.900',
        color: 'white',
      }}
      >
        {props.children}
      </ChakraContainer>
    </ScaleFade>
  </Flex>
)
