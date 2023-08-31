# Layouts ([Nuxt](https://nuxt.com/docs/guide/directory-structure/layouts))

Este template inclui alguns layouts pré-definidos que você pode utilizar no seu projeto:

1. `admin.vue`: Usado nas páginas internas quando o usuário está autenticado. Exemplo de uso:

```vue

<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
```

2. `login.vue`: Usado na tela de login.

3. `guest.vue`: Usado para páginas acessíveis por usuários não autenticados.

## Customizando layouts

O layout funciona como um componente vue3 com [slots nomeados](https://vuejs.org/guide/components/slots.html#named-slots).

Então podemos fornecer um conteúdo para esses slotes da seguinte forma:

Crie um layout novo no seu projeto, por exemplo:

**layouts/admin.vue:**
```vue
<template>
  <AdminLayout>
    <template #footer>
      <div class="float-right d-none d-sm-block">
        <div class="user-panel">
          <img
              src="@assets/adminlte/img/user2-160x160.jpg"
              class="img-circle elevation-2"
              alt="User Image"
          >
          <b>Version</b> 3.2.0
        </div>

      </div>
      <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.

    </template>
  </AdminLayout>
</template>

<script setup>
import { AdminLayout } from '@agtm/nuxt-layer-adminlite-primeface'
</script>
```

**Nota:** Verifique os slots dos layouts disponiveis diretamente no código fonte:

    src/layouts/admin.vue    

e

    index.mjs

