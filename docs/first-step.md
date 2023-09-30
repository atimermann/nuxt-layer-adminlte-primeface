# Primeiros Passos

Depois de instalar e configurar o template, podemos iniciar o desenvolvimento com alguma dicas iniciais importante:

## Prime vs Bootstrap

Como estamos utilizando dois frameworks de css, podem existir confusão e conflito sobre qual framework utilizar em cada
cenário.

Para evitar isso vamos padronizar aqui

| Descrição                       | Framework |
|---------------------------------|-----------|
| Container (não existe no Prime) | Bootstrap |
| Grid (Flex)                     | Primeflex |

## Container principal

Uma dificuldade comum é definir o alinhamento e espaçamento padrão das páginas. Como estamos utilizando o template
AdminLTE, que herda o bootstrap, então está sendo utilizado os componentes de container do Bootstrap.

Documentação Aqui:

https://getbootstrap.com/docs/5.3/layout/containers

Então você precisa definir o container que deseja em cada página, por exemplo container fluído:

```vue

<template>
  <div class="container-fluid">
    <NfCard>
      <template #title>
        Title
      </template>

      <template #footer>
        Footer
      </template>
      <template #content>
        <DataTable :value="products" table-style="min-width: 50rem" show-gridlines>
          <Column field="code" header="Code"/>
          <Column field="name" header="Name"/>
          <Column field="category" header="Category"/>
          <Column field="quantity" header="Quantity"/>
        </DataTable>
      </template>
    </NfCard>
  </div>
</template>
```

**IMPORTANTE:** Caso não defina container, o conteúdo ficará desalinhado.

**DICA:** Você pode verificar o layout padrão em layouts

**NfCard:** NfCard é um componente implementado diretamente no nuxt-layer-adminlite-primevface, provavelmente será o
compomente mais utilizado no projeto. Difere do Card do PrimeVue que tem um propósito diferente. veja mais
em [NfCards](./components/nf-card.md)

## Componentes PrimeVue

Deve ser importado diretamente no componente onde será usado.

Exemplo:

```vue

<template>
  <div class="container-fluid">
    <NfCard>
      <template #content>
        <DataTable :value="products" table-style="min-width: 50rem" show-gridlines>
          <Column field="code" header="Code"/>
          <Column field="name" header="Name"/>
          <Column field="category" header="Category"/>
          <Column field="quantity" header="Quantity"/>
        </DataTable>
      </template>
    </NfCard>
  </div>
</template>

<script setup>

  import Card from 'primevue/card'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'

  [...]

</script>

```