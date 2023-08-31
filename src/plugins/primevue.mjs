/**
 * **Created on 31/03/2023**
 *
 * src/plugins/primevue.mjs
 * @author André Timermann <andre@timermann.com.br>
 *
 * TODO: Reduzir ao máximo a quantidade de componentes Prime carregado automaticamente por aqui, é preferível importar
 *  diretamente no componente
 *
 */

import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'

import { pt } from '../locale/locale.mjs'
// Módulos carregados

// TODO: Removido todos os componentes, importar diretamente no componente que vai utilizar

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true, locale: pt })
})
