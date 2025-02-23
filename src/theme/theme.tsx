import { createSystem, defaultConfig, defineConfig, defineTokens } from '@chakra-ui/react'

const TOKENS = defineTokens({
  colors: {
    blue: { value: '#0C68E9' }
  },
  fonts: {
    body: { value: 'Nunito, sans-serif' }
  }
})

const CONFIG = defineConfig({
  theme: {
    tokens: TOKENS,
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

export const SYSTEM = createSystem(CONFIG, defaultConfig)
