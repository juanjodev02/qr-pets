import { extendTheme } from '@chakra-ui/react'
import { StepsTheme as Steps } from 'chakra-ui-steps';

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: '#16161D',
        _dark: '#16161D',
      },
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#7928CA',
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#FF0080',
      },
    },
    radii: {
      button: '12px',
    },
  },
  colors: {
    black: '#16161D',
  },
  fonts,
  breakpoints,
  components: {
    Steps
  }
})

export default theme
