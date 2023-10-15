# Desenvolvendo seu projeto enquanto melhora o Nuxt Layer Admin PrimeFace

## Visão Geral

Este projeto visa estabelecer um template padrão para o Nuxt 3 utilizando a ferramenta Layers. Com o objetivo de
unificar dois templates amplamente apreciados - AdminLTE3 e PrimeFace, por meio do PrimeVue, esse projeto oferece uma
abordagem integrada e visualmente atrativa para a construção de interfaces. Utilizamos o MJS disponível na versão do
NodeJS.

## Configuração obrigatória antes de publicar nova versão

Criar arquivo .env com seguinte conteudo:

```dotenv
CI=true
GH_TOKEN=ghp_<TOKEN_GIT_HUB>
NPM_TOKEN=npm_<TOKEN_NPM>
```

## Configuração Global

A configuração global do template, que é herdada por seu projeto, está localizada no seguinte arquivo:

    ```nuxt.config.mjs```

## Configuração do PrimeVue

A configuração do PrimeVue pode ser encontrada em:

    ```src/plugins/primevue.mjs```

## AdminLTE

O AdminLTE é um sistema de templates simples, que não está diretamente relacionado ao Nuxt.js ou Vue.js. É,
essencialmente, um conjunto de arquivos CSS e HTML. Todo o código fonte do template foi adicionado à pasta "assets", e o
CSS é carregado por meio do "nuxt.config.mjs".

Por favor, note que a configuração do FontAwesome ainda não foi concluída.

## Utilizando o PrimeVue

Alguns componentes comuns foram carregados em ```src/plugins/primevue.mjs```, conforme a documentação do PrimeVue. No
entanto, você tem a liberdade de adicionar outros componentes diretamente no seu componente Vue 3.

Segue um exemplo:

```vue

<template>
  <div class="card">
    <Panel>
      <template #header>
        <h3 class="card-title">
          <i class="fas fa-tag"/>
          Color Palette
        </h3>
      </template>

      <template #content>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Panel>
  </div>

</template>

<script setup>

  import Panel from 'primevue/panel'

</script>

<style scoped>

</style>
```

## Ajustando Componentes Carregados por Padrão

No arquivo ```src/plugins/primevue.mjs```, você pode remover e adicionar componentes padrão, conforme o que será
habitualmente usado no seu projeto.

## Personalizando o Template do PrimeFace

Por padrão, o PrimeFace não carrega nenhum template, então é necessário adquirir um template pré-definido ou criar o seu
próprio.

Para mais informações, veja a [documentação do PrimeVue sobre temas](https://primevue.org/theming/).

No nuxt-layer-admin-primeface, o tema pode ser encontrado em:

    src/assets/theme.css

Você pode modificá-lo conforme melhora o layout do nuxt-layer-admin-primeface.

Note que estamos combinando dois templates diferentes: AdminLte e Primeface. Alguns conflitos podem ocorrer, e é aqui
que você deve alterar o layout do Primeface para aproximá-lo mais do AdminLTE.

Por outro lado, o CSS do AdminLTE pode ser alterado em:

    src/assets/adminlte/css/*

## Atualizando com AdminLTE

Baixe o AdminLTE 3 e rode localmente com http-server para facilitar a atualização deste template com as funcionalidades
do AdminLte, correção e adição CSS

## Configurando o ambiente para desenvolver o seu projeto em conjunto com o nuxt-layer-adminlte-primeface

Crie um script na raiz do seu projeto com o seguinte código:

```shell
rm -rf node_modules/@agtm/nuxt-layer-adminlte-primeface
ln -s [LOCAL DO CÓDIGO FONTE DO NUXT-LAYER-ADMINLTE-PRIMEFACE]/nuxt-layer-adminlte-primeface node_modules/@agtm/nuxt-layer-adminlte-primeface
```

**Nota:** Por algum motivo, o npm link não funcionou. Se ele funcionar para você, use-o no lugar do comando acima.

## Parametrização

A parametrização do template deve ser definida em:

    src/app.config.mjs

Nesse arquivo, devem ser definidos parâmetros que serão usados para personalizar o template em vários projetos
diferentes. Exemplos incluem a configuração do menu, o logo e o título da página.

## Layouts e Páginas

Este template fornece alguns layouts e páginas, além de uma estrutura padrão.

## Pendências (TODO)

Algumas funcionalidades ainda precisam ser implementadas:

* Autenticação
* Menu de fácil configuração
* Interface gráfica para a configuração de menu (vinculada ao backend)
* Diversas funções interessantes fornecidas pelo AdminLTE
* Finalização da configuração do FontAwesome (ou sua remoção)
* Internacionalização
