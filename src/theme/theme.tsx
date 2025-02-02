import { createSystem, defaultConfig, defineConfig, defineTokens } from '@chakra-ui/react'

const tokens = defineTokens({
  colors: {
    blue: { value: '#0C68E9' }
  }
})

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens: {
      colors: {
        'menu-bg': {
          value: { _light: 'white', _dark: '#141B21' }
        },
        background: {
          value: { _light: '#F5F5F5', _dark: '#111315' }
        }
      }
    }
  }
})

export const system = createSystem(config, defaultConfig)
