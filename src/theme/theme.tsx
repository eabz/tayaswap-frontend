import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const CONFIG = defineConfig({
  globalCss: {
    body: {
      fontFamily: 'Nunito',
      color: 'text-color',
      fontWeight: '600'
    }
  },
  theme: {
    tokens: {
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
      },
      fonts: {
        body: { value: 'Nunito, sans-serif' }
      }
    },
    semanticTokens: {
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
          value: { _light: '#6F767E', _dark: '#9FA2A4' }
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
          value: { _light: '#6F767E', _dark: '#9FA2A4' }
        },
        'button-group-button-active-color': {
          value: { _light: 'black', _dark: 'white' }
        }
      }
    }
  }
})

export const SYSTEM = createSystem(CONFIG, defaultConfig)
