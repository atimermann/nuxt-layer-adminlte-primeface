# Nuxt Layer AdminLTE + PrimeFace

Este projeto é uma camada do Nuxt 3 (layer) desenvolvida para facilitar a integração
do [PrimeVue 3](https://primefaces.org/primevue/) e do [AdminLTE 3](https://adminlte.io/themes/v3/). Esta camada é
projetada para ser facilmente adicionada a qualquer projeto Nuxt 3, fornecendo um template completo e funcional para
construção de aplicações web.

Você pode consultar a documentação oficial do Nuxt 3 [aqui](https://v3.nuxtjs.org/).

## Requisitos

Antes de prosseguir com a instalação desta camada, certifique-se de que seu projeto Nuxt 3 esteja configurado e
funcionando corretamente. Caso ainda não tenha um projeto Nuxt 3, siga as instruções
na [documentação oficial](https://nuxt.com/docs/getting-started/introduction) para criar um novo projeto.

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

Para personalizar o template você pode custimizar o layout (veja próximo tópico) e através de configuração no
app.config

[Consulte aqui refêrencia completa do app.config](./docs/config.md)

## Desenvolvendo seu projeto em conjunto com o template

[Clique aqui para entender como trabalhar com este template em seu projeto](./docs/config.md)

## Layouts

[Documentação completa sobre Layout](./docs/layout.md)

## Arquivo App.vue

Este template inclui um arquivo `app.vue` com o seguinte conteúdo:

```vue

<template>
  <NuxtLayout/>
</template>
```

Este arquivo serve como um ponto de entrada para os layouts e páginas da sua aplicação. O componente `<NuxtLayout />` é
responsável por renderizar o layout apropriado, dependendo da configuração das metadados da página.

## Uso do PrimeVue

Cada componente do PrimeVue pode ser importado individualmente, garantindo que você inclua no pacote apenas o que
realmente utilizar. O caminho de importação está disponível na documentação do componente correspondente.

Por exemplo, para importar e utilizar o componente `Button` do PrimeVue:

```javascript
import Button from "primevue/button"

const app = createApp(App);
app.component('Button', Button);
```

Você pode simplesmente criar um plugin para isso:

Exemplo:

    src/plugins/primevue.mjs

```javascript
import {defineNuxtPlugin} from '#app'

// Módulos carregados
import Card from 'primevue/card'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Card', Card)
})
```

# Desenvolvimento

Para obter mais informações sobre como implementar e trabalhar com camadas (layers) no Nuxt, consulte
a [documentação oficial do Nuxt sobre a criação de layers](https://nuxt.com/docs/getting-started/layers).



## Working on your theme

Your theme is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on
NPM.

The `playground` directory should help you on trying your theme during development.

Running `npm dev` will prepare and boot `playground` directory, which imports your theme itself.

## Development Server

Start the development server on http://localhost:3000

```bash
npm dev
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment) for more information.
