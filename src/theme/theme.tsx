import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const TOKENS = {
  colors: {
    'custom-blue': { value: '#0C68E9' },
    'custom-gray': {
      100: { value: '#FAFAFA' },
      200: { value: '#F5F5F5' },
      300: { value: '#EDEDED' },
      400: { value: '#D7D8DC' },
      500: { value: '#B6BAC3' },
      600: { value: '#A7ACB0' },
      700: { value: '#808287' },
      800: { value: '#6F767E' },
      900: { value: '#1A1D1F' }
    }
  }
}

const SEMANTIC_TOKENS = {
  colors: {
    'menu-bg': {
      value: { _light: 'white', _dark: '#141B21' }
    },
    background: {
      value: { _light: '#F3F4F6', _dark: '#111315' }
    },
    'accent-button-background': {
      value: { _light: '#F3F4F6', _dark: '#ffffff1a' }
    },
    'accent-button-color': {
      value: { _light: '{colors.custom-blue}', _dark: 'white' }
    },
    'text-color': {
      value: { _light: '{colors.custom-gray.800}', _dark: '#9FA2A4' }
    },
    'input-background': {
      value: { _light: 'white', _dark: '#fcfcfc0d' }
    },
    'input-border': {
      value: { _light: 'white', _dark: '#EFEFEF47' }
    },
    'button-group-background': {
      value: { _light: 'white', _dark: '#fcfcfc08' }
    },
    'button-group-button-background': {
      value: { _light: '#F3F4F6', _dark: '#efefef26' }
    },
    'button-group-button-color': {
      value: { _light: '{colors.custom-gray.800}', _dark: '#9FA2A4' }
    },
    'button-group-button-active-color': {
      value: { _light: 'black', _dark: 'white' }
    },
    'table-background': {
      value: { _light: 'white', _dark: '#141B21' }
    },
    'table-border': {
      value: { _light: 'white', _dark: '{colors.custom-blue}' }
    },
    'table-outer-background': {
      value: { _light: 'white', _dark: '#232B3B' }
    }
  }
}

const CONFIG = defineConfig({
  globalCss: {
    body: {
      fontFamily: 'Nunito',
      color: 'text-color',
      fontWeight: '600'
    }
  },
  theme: {
    tokens: TOKENS,
    semanticTokens: SEMANTIC_TOKENS
  }
})

export const SYSTEM = createSystem(CONFIG, defaultConfig)
