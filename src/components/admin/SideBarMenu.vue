<template>
  <nav class="mt-2">
    <ul
      class="nav nav-pills nav-sidebar flex-column"
    >
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        class="nav-item"
        :class="{ 'menu-open': item.isOpen }"
      >
        <a
          :href="item.link"
          class="nav-link"
          :class="{ active: item.active }"
          @click.prevent="toggleSubMenu(item)"
        >
          <i :class="['nav-icon', ...item.iconClasses]" />
          <p>
            {{ item.title }}
            <i v-if="item.subItems" class="right fas fa-angle-left" />
            <span v-if="item.badge" :class="['badge', ...item.badgeClasses]">{{ item.badge }}</span>
          </p>
        </a>
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

const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
})

function closeAllMenus () {
  props.menuItems.forEach((item) => {
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
