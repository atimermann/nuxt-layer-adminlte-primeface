<template>
  <nav class="mt-2">
    <ul
      class="nav nav-pills nav-sidebar flex-column"
    >
      <li
        v-for="(item, index) in template.menu.items"
        :key="index"
        class="nav-item"
        :class="{ 'menu-open': item.isOpen }"
      >
        <nuxt-link
          :href="item.link"
          class="nav-link"
          :class="{ active: item.active }"
          @click.prevent="toggleSubMenu(item)"
        >

          <i v-if="item.iconClasses" :class="['nav-icon', ...item.iconClasses]" />
          <p>
            {{ item.title }}
            <i v-if="item.subItems" class="right fas fa-angle-left" />
            <span v-if="item.badge" :class="['badge', ...item.badgeClasses]">{{ item.badge }}</span>
          </p>
        </nuxt-link>
        <template v-if="item.subItems">
          <transition name="slide-fade">
            <ul v-show="item.isOpen" class="nav nav-treeview pl-3">
              <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex" class="nav-item">
                <a :href="subItem.link" class="nav-link" :class="{ active: subItem.active }">
                  <i :class="['nav-icon', ...subItem.iconClasses]" />
                  <p>{{ subItem.title }}</p>
                </a>
              </li>
            </ul>
          </transition>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup>

/*
TODO: Implementar active corretamente para exibir o menu ativo
    Implementar menu perfil no lado direito superior
    Implementar configuração de menu
*/

const { template } = useAppConfig()

function closeAllMenus () {
  template.menu.items.forEach((item) => {
    item.isOpen = false
  })
}

function toggleSubMenu (item) {
  if (item.isOpen) {
    item.isOpen = false
  } else {
    closeAllMenus()
    item.isOpen = true
  }
}

// const x = [
//     {
//       "title": "Dashboard",
//       "iconClasses": [
//         "pi",
//         "pi-home"
//       ],
//       "link": "#",
//       "active": true,
//       "subItems": [
//         {
//           "title": "Dashboard v1",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v2",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index2.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v3",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index3.html",
//           "active": false
//         }
//       ],
//       "badge": null,
//       "badgeClasses": null,
//       "isOpen": false
//     },
//     {
//       "title": "Widgets",
//       "iconClasses": [
//         "pi",
//         "pi-calculator"
//       ],
//       "link": "../widgets.html",
//       "active": false,
//       "subItems": [
//         {
//           "title": "Dashboard v1",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v2",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index2.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v3",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index3.html",
//           "active": false
//         }
//       ],
//       "badge": "New",
//       "badgeClasses": [
//         "badge-danger"
//       ],
//       "isOpen": false
//     },
//     {
//       "title": "Calendar",
//       "iconClasses": [
//         "pi",
//         "pi-calendar"
//       ],
//       "link": "../calendar.html",
//       "active": false,
//       "subItems": [
//         {
//           "title": "Dashboard v1",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v2",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index2.html",
//           "active": false
//         },
//         {
//           "title": "Dashboard v3",
//           "iconClasses": [
//             "pi",
//             "pi-circle-on"
//           ],
//           "link": "../../index3.html",
//           "active": false
//         }
//       ],
//       "badge": "2",
//       "badgeClasses": [
//         "badge-info"
//       ],
//       "isOpen": false
//     },
//     {
//       "title": "Kanban Board",
//       "iconClasses": [
//         "pi",
//         "pi-clone"
//       ],
//       "link": "../kanban.html",
//       "active": false,
//       "subItems": [],
//       "badge": null,
//       "badgeClasses": null,
//       "isOpen": false
//     }
//   ],
//   "_value"
// :
// [
//   {
//     "title": "Dashboard",
//     "iconClasses": [
//       "pi",
//       "pi-home"
//     ],
//     "link": "#",
//     "active": true,
//     "subItems": [
//       {
//         "title": "Dashboard v1",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v2",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index2.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v3",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index3.html",
//         "active": false
//       }
//     ],
//     "badge": null,
//     "badgeClasses": null,
//     "isOpen": false
//   },
//   {
//     "title": "Widgets",
//     "iconClasses": [
//       "pi",
//       "pi-calculator"
//     ],
//     "link": "../widgets.html",
//     "active": false,
//     "subItems": [
//       {
//         "title": "Dashboard v1",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v2",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index2.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v3",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index3.html",
//         "active": false
//       }
//     ],
//     "badge": "New",
//     "badgeClasses": [
//       "badge-danger"
//     ],
//     "isOpen": false
//   },
//   {
//     "title": "Calendar",
//     "iconClasses": [
//       "pi",
//       "pi-calendar"
//     ],
//     "link": "../calendar.html",
//     "active": false,
//     "subItems": [
//       {
//         "title": "Dashboard v1",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v2",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index2.html",
//         "active": false
//       },
//       {
//         "title": "Dashboard v3",
//         "iconClasses": [
//           "pi",
//           "pi-circle-on"
//         ],
//         "link": "../../index3.html",
//         "active": false
//       }
//     ],
//     "badge": "2",
//     "badgeClasses": [
//       "badge-info"
//     ],
//     "isOpen": false
//   },
//   {
//     "title": "Kanban Board",
//     "iconClasses": [
//       "pi",
//       "pi-clone"
//     ],
//     "link": "../kanban.html",
//     "active": false,
//     "subItems": [],
//     "badge": null,
//     "badgeClasses": null,
//     "isOpen": false
//   }
// ]

</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.2s ease;
}

.slide-fade-enter-from {
    transform-origin: top left;
    transform: scale(0);
    opacity: 0;
}

.slide-fade-leave-to {
    transform-origin: top left;
    transform: scale(0);
    opacity: 0;
}
</style>
