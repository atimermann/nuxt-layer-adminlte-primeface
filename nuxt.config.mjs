import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// TODO: Alterar quando for corrigido
// https://nuxt.com/docs/guide/going-further/layers#relative-paths-and-aliases
const currentDir = dirname(fileURLToPath(import.meta.url))

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src',
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback'
        }
      ]
    }
  },
  css: [
    // ========================
    //  PRIME CONFIG
    // ========================

    // 'primevue/resources/themes/bootstrap4-light-blue/theme.css', (Não usar direto)

    join(currentDir, './src/assets/theme.css'),
    // '~/assets/theme.css', // (Customizado) Este arquivo foi gerado em https://designer.primevue.org/#/ e modificado
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',

    // ========================
    //  ADMIN LTE CONFIG
    // ========================
    join(currentDir, './src/assets/adminlte/css/adminlte.css'),

    // ========================
    // fortawesome
    // ========================
    '@fortawesome/fontawesome-svg-core/styles.css'

  ],
  build: {
    transpile: ['primevue']
  },
  vite: {
    resolve: {
      alias: {
        '@assets': join(currentDir, 'src', 'assets')
      }
    }
  }
})
