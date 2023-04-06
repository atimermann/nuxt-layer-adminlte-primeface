import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "admin" | "guest"
declare module "/home/andre/projetos/@agtm/nuxt-layer-adminlite-primeface/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}