/**
 * **Created on 31/03/2023**
 *
 * src/runtime/plugins/primevue.mjs
 * @author André Timermann <andre@timermann.com.br>
 *
 */

import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'

import { pt } from '../locale/locale.mjs'
// Módulos carregados
import PanelMenu from 'primevue/panelmenu'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Breadcrumb from 'primevue/breadcrumb'
import Tree from 'primevue/tree'

// Form Fields
import InputText from 'primevue/inputtext'
import AutoComplete from 'primevue/autocomplete'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true, locale: pt })
  nuxtApp.vueApp.component('PanelMenu', PanelMenu)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('DataTable', DataTable)
  nuxtApp.vueApp.component('Column', Column)
  nuxtApp.vueApp.component('Breadcrumb', Breadcrumb)
  nuxtApp.vueApp.component('Tree', Tree)

  // Form Fields
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('AutoComplete', AutoComplete)
  nuxtApp.vueApp.component('Calendar', Calendar)
  nuxtApp.vueApp.component('InputNumber', InputNumber)
})
