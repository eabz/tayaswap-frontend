import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: '#0C68E9' }
        }
      }
    },
    semanticTokens: {
      colors: {
        'button-active': { value: 'gray.200' }
      }
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)
