import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: '..',
  imports: {
    // Desabilita auto-importas para melhor raastreabilidade de código
    autoImport: false
  }
})
