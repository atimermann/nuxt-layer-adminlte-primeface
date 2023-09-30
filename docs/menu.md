Documentação: Gerador de Menu
=============================

Descrição
---------

O componente gera um menu de navegação baseado em um objeto `template.menu` fornecido.

template.menu deve ser configurado em app.vue

```javascript
const appConfig = useAppConfig()

appConfig.template = {
}
```


Estrutura do Objeto Menu
------------------------

A estrutura básica do objeto que define o menu é a seguinte:

*   **title**: Nome do item do menu.
*   **iconClasses**: Classes de ícone associadas ao item do menu.
*   **link**: Link de redirecionamento ao clicar no item do menu.
*   **active**: Indica se o item do menu está ativo (realça o item).
*   **subItems**: Lista de subitens que aparecem como um submenu dropdown.
*   **badge**: Número ou texto que aparece como uma insígnia no item do menu.
*   **badgeClasses**: Classes de estilo para a insígnia.
*   **isOpen**: Indica se o submenu está aberto.

### Exemplo de um item do menu:

```json
{
  "title": "Dashboard",
  "iconClasses": ["pi", "pi-home"],
  "link": "#",
  "active": true,
  "subItems": [
    {
      "title": "Dashboard v1",
      "iconClasses": ["pi", "pi-circle-on"],
      "link": "../../index.html",
      "active": false
    }
  ],
  "badge": null,
  "badgeClasses": null,
  "isOpen": false
}

```
Como criar um novo item de menu
-------------------------------

1.  **Definindo o título e o ícone**:

    *   `title`: Define o texto do item.
    *   `iconClasses`: Adicione as classes do ícone que você deseja mostrar.
2.  **Link de navegação**:

    *   `link`: Adicione o link de redirecionamento para o item do menu.
3.  **Definindo se o item está ativo**:

    *   `active`: Defina como `true` se o item estiver ativo.
4.  **Adicionando subitens (se necessário)**:

    *   `subItems`: Se você quiser adicionar subitens, crie uma lista de objetos com a mesma estrutura do item principal.
5.  **Adicionando uma insígnia (se necessário)**:

    *   `badge`: Adicione um texto ou número para a insígnia.
    *   `badgeClasses`: Classes para estilizar a insígnia.
6.  **Controlando a exibição do submenu**:

    *   `isOpen`: Defina como `true` se o submenu estiver aberto por padrão.

Funcionalidades adicionais
--------------------------

*   **toggleSubMenu**: Esta função controla a exibição do submenu. Ao clicar em um item que possui subitens, o submenu será mostrado ou escondido.

*   **closeAllMenus**: Esta função fecha todos os submenus.


Notas
-----

*   Certifique-se de fornecer um link válido em `link` para garantir que a navegação funcione corretamente.
*   As classes `iconClasses` são baseadas na biblioteca de ícones que você está usando (no exemplo, parece ser "PrimeIcons"). Certifique-se de que a biblioteca de ícones esteja corretamente integrada ao seu projeto.
*   Lembre-se de que, ao adicionar subitens, eles também devem seguir a mesma estrutura de um item de menu.