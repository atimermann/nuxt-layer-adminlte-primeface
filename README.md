# Nuxt Layer AdminLTE + PrimeFace

Este projeto é uma camada do Nuxt 3 (layer) desenvolvida para facilitar a integração
do [PrimeVue 3](https://primefaces.org/primevue/) e do [AdminLTE 3](https://adminlte.io/themes/v3/). Esta camada é
projetada para ser facilmente adicionada a qualquer projeto Nuxt 3, fornecendo um template completo e funcional para
construção de aplicações web.

Você pode consultar a documentação oficial do Nuxt 3 [aqui](https://v3.nuxtjs.org/).

## Requisitos

Antes de prosseguir com a instalação desta camada, certifique-se de que seu projeto Nuxt 3 esteja configurado e
funcionando corretamente. Caso ainda não tenha um projeto Nuxt 3, siga as instruções
na [documentação oficial](https://v3.nuxtjs.org/docs/getting-started/introduction) para criar um novo projeto.

## Instalação

Para instalar esta camada do Nuxt 3, siga os passos abaixo:

1. Abra o terminal na raiz do seu projeto Nuxt 3.
2. Execute o comando abaixo para instalar a camada via npm:

```bash
npm install --save @agtm/nuxt-layer-adminlte-primeface
```

## Configuração

No arquivo nuxt.config.js, adicione a camada no array buildModules:

```javascript
defineNuxtConfig({
  extends: '@agtm/nuxt-layer-adminlte-primeface'
})
```

## Layouts Inclusos

Esta camada inclui alguns layouts pré-definidos que você pode utilizar em seu projeto:

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

## Arquivo App.vue

Este template inclui um arquivo `app.vue` com o seguinte conteúdo:

```vue
<template>
<NuxtLayout />
</template>
```

Este arquivo serve como um ponto de entrada para os layouts e páginas da sua aplicação. O componente `<NuxtLayout />` é responsável por renderizar o layout apropriado, dependendo da configuração das metadados da página.


## Uso do PrimeVue

Cada componente do PrimeVue pode ser importado individualmente, garantindo que você inclua no pacote apenas o que
realmente utilizar. O caminho de importação está disponível na documentação do componente correspondente.

Por exemplo, para importar e utilizar o componente `Button` do PrimeVue:

```javascript
import Button from "primevue/button"

const app = createApp(App);
app.component('Button', Button);
```

# Desenvolvimento

Para obter mais informações sobre como implementar e trabalhar com camadas (layers) no Nuxt, consulte
a [documentação oficial do Nuxt sobre a criação de layers](https://nuxt.com/docs/getting-started/layers).

## Working on your theme

Your theme is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on
NPM.

The `.playground` directory should help you on trying your theme during development.

Running `npm dev` will prepare and boot `.playground` directory, which imports your theme itself.

## Development Server

Start the development server on http://localhost:3000

```bash
npm dev
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment) for more information.
