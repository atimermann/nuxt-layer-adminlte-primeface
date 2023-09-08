# Componente NfCard

O componente Card é o mais amplamente utilizado neste template. Você pode usá-lo para qualquer coisa, desde a exibição de gráficos até simples blocos de texto. Ele está disponível em muitos estilos diferentes que exploraremos abaixo.

Baseado no card do AdminLTE:  https://adminlte.io/docs/3.1//components/cards.html

## Slots

Para utilizar este componente você precisa definir o conteudo nos seguintes slots:

- `title`: para definir o título do card.
- `tools`: para adicionar ferramentas ou ações extras no cabeçalho do card.
- `content`: para inserir o conteúdo principal do card.
- `footer`: para adicionar um rodapé ao card.
- `overlay`: para inserir conteúdo na sobreposição (quando a propriedade `overlay` está em uso).

Exemplo com todos os slots sendo usados:

```html

<NfCard type="info" outline bg="gradient-primary" overlay="dark">
    <template #title>
        Título do Card
    </template>
    <template #tools>
        <!-- ícones/ferramentas aqui -->
    </template>
    <template #content>
        Conteúdo principal aqui.
    </template>
    <template #footer>
        Rodapé do card aqui.
    </template>
    <template #overlay>
        Conteúdo da sobreposição aqui.
    </template>
</NfCard>
```


## Propriedades

Aqui estão as propriedades que você pode usar para personalizar o componente Card:

### `type`

Esta propriedade define o tipo de card que será exibido. Aceita as seguintes strings como valores:

- `"primary"`
- `"secondary"`
- `"success"`
- `"info"`
- `"warning"`
- `"danger"`
- `"dark"`

Cada uma dessas opções altera o esquema de cores do card. Aqui está um exemplo de como usar essa propriedade:

```html
<NfCard type="success">
  <!-- conteúdo do card -->
</NfCard>
```

### `outline`

Esta propriedade é um booleano que, quando definido como `true`, aplica um estilo de contorno ao card. Exemplo:

```html
<NfCard outline>
  <!-- conteúdo do card -->
</NfCard>
```

### `bg`

Esta propriedade permite definir uma cor de fundo personalizada para o card. Os valores aceitáveis são:

- `"primary"`
- `"secondary"`
- `"success"`
- `"info"`
- `"warning"`
- `"danger"`
- `"dark"`
- `"gradient-primary"`
- `"gradient-secondary"`
- `"gradient-success"`
- `"gradient-info"`
- `"gradient-warning"`
- `"gradient-danger"`
- `"gradient-dark"`

Assim como a propriedade `type`, esta propriedade muda a cor de fundo do card. Veja um exemplo de uso:

```html
<NfCard bg="gradient-primary">
  <!-- conteúdo do card -->
</NfCard>
```

### `overlay`

A propriedade `overlay` aceita duas strings como valores: `"dark"` e `"light"`. Isso permite que você coloque uma sobreposição escura ou clara sobre o card. Exemplo de uso:

Normalmente utilizado para "loading" 

```html
<NfCard overlay="dark">
    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
    Carregando...
</NfCard>
```

