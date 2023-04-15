# Refêrencia de configuração do template

Para configurar o template crie um arquivo app.config.ts(mjs, cjs, js) na raiz do projeto:

**exemplo:**
app.config.mjs

```javascript
export default {
  template: {
    logoPath: 'DEFAULT'
  }
}
```

# Importação de arquivo

**Refs:**
* https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations

Você pode carregar arquivos da pasta assets usando da seguinte forma:

```javascript
const filePath = (await import('~/assets/adminlte/img/user1-128x128.jpg')).default
```

Ao utilizar o método import, o nuxt irá injetar automaticamente o arquivo no bundle gerado, e irá retornar o caminho
desse arquivo, utilize await pois é um métoco assincrono e dafault para converter para ESM (com CJS não é necessário).

Este método, não funciona no app.config, pois não é processado pelo Vite, para resolver este problema você pode
configurar o template da seguinte forma:

Crie um arquivo app.config na raiz da aplicação:

src/app.vue:

```vue
<template>
  <NuxtLayout />
</template>

<script setup>

// ----------------------------------------------------------------------
// Configuração do Template
// ----------------------------------------------------------------------

const appConfig = useAppConfig()

appConfig.template = {
  logoPath: (await import('~/assets/img/logo.png')).default
}

</script>

```

**REF:**

* https://nuxt.com/docs/getting-started/assets#assets-directory

# Refêrencia

| Propriedade | Descrição       | Padrão | Exemplo                                         |
|-------------|-----------------|--------|-------------------------------------------------|
| logoPath    | Caminho da logo |        | (await import('~/assets/img/logo.png')).default |
|             |                 |        |                                                 |
|             |                 |        |                                                 |
```
