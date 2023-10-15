/**
 * **Created on 16/04/2023**
 *
 * src/middleware/auth.mjs
 * @author André Timermann <andre@timermann.com.br>
 *
 */

import { defineNuxtRouteMiddleware } from '#imports'

let logged = false
export default defineNuxtRouteMiddleware((to, from) => {
  // if (to.path !== '/login' && !logged) {
  //   logged = true
  //   return navigateTo({path: '/login'})
  // }
})
