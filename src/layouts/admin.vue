<template>
  <div class="control-sidebar-slide-open sidebar-mini" :class="{'sidebar-collapse': colapsedMenu}">
    <div class="wrapper">
      <!-- Navbar -->
      <TopNavbar>
        <RightNavbarLinks>
          <!-- Include other right navbar items like search, messages, notifications, etc. -->
        </RightNavbarLinks>
      </TopNavbar>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <MainSidebar>
        <!--      <SidebarSearch />-->
        <side-bar-menu />
      </MainSidebar>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <ContentHeader />
        <!-- Main content -->
        <section class="content">
          <nuxtPage />
        </section>
        <!-- /.content -->
      </div>

      <footer class="main-footer">
        <slot name="footer">
          <!-- TODO: Estudar uma forma do usuário poder inserir um componente aqui, sem ser apenas texto-->
          <div class="flex justify-content-end">
            {{ template.version || 'Nuxt Admin' }}
          </div>
        </slot>
      </footer>

      <!-- /.control-sidebar -->
    </div>
  </div>
</template>

<script setup>

// TODO: Puxar as classes dessa maneira e salvar em utils
// TODO: Configuração em parametros app.config.ts
// TODO: Documentar tudo aqui e no zim (De preferencia criar cheatChet)
// import {MenuItem, SubMenuItem} from '@agtm/nuxt-layer-adminlte-primevue'

import { useAppConfig, ref, provide } from '#imports'

import SideBarMenu from '../components/admin/SideBarMenu.vue'
import TopNavbar from '../components/admin/TopNavbar.vue'
import RightNavbarLinks from '../components/admin/RightNavbarLinks.vue'
import MainSidebar from '../components/admin/MainSidebar.vue'
// import SidebarSearch from '../components/admin/SidebarSearch.vue'
import ContentHeader from '../components/admin/ContentHeader.vue'

const { template } = useAppConfig()

const colapsedMenu = ref(false)

function colapseMenu () {
  colapsedMenu.value = !colapsedMenu.value
}

provide('colapseMenu', colapseMenu)

class MenuItem {
  constructor (title, iconClasses, link) {
    this.title = title
    this.iconClasses = iconClasses
    this.link = link
    this.active = false
    this.subItems = []
    this.badge = null
    this.badgeClasses = null
    this.isOpen = false
  }

  setActive (active) {
    this.active = active
    return this
  }

  addSubItem (subItem) {
    if (subItem instanceof SubMenuItem) {
      this.subItems.push(subItem)
    } else {
      throw new Error('Invalid subItem. Expected instance of SubMenuItem.')
    }
    return this
  }

  setBadge (badge, badgeClasses) {
    this.badge = badge
    this.badgeClasses = badgeClasses
    return this
  }
}

class SubMenuItem {
  constructor (title, iconClasses, link) {
    this.title = title
    this.iconClasses = iconClasses
    this.link = link
    this.active = false
  }

  setActive (active) {
    this.active = active
    return this
  }
}

const dashboard = new MenuItem('Dashboard', ['pi', 'pi-home'], '#')
  .setActive(true)
  .addSubItem(new SubMenuItem('Dashboard v1', ['pi', 'pi-circle-on'], '../../index.html'))
  .addSubItem(new SubMenuItem('Dashboard v2', ['pi', 'pi-circle-on'], '../../index2.html'))
  .addSubItem(new SubMenuItem('Dashboard v3', ['pi', 'pi-circle-on'], '../../index3.html'))

const widgets = new MenuItem('Widgets', ['pi', 'pi-calculator'], '../widgets.html')
  .setBadge('New', ['badge-danger'])
  .addSubItem(new SubMenuItem('Dashboard v1', ['pi', 'pi-circle-on'], '../../index.html'))
  .addSubItem(new SubMenuItem('Dashboard v2', ['pi', 'pi-circle-on'], '../../index2.html'))
  .addSubItem(new SubMenuItem('Dashboard v3', ['pi', 'pi-circle-on'], '../../index3.html'))

const calendar = new MenuItem('Calendar', ['pi', 'pi-calendar'], '../calendar.html')
  .setBadge('2', ['badge-info'])
  .addSubItem(new SubMenuItem('Dashboard v1', ['pi', 'pi-circle-on'], '../../index.html'))
  .addSubItem(new SubMenuItem('Dashboard v2', ['pi', 'pi-circle-on'], '../../index2.html'))
  .addSubItem(new SubMenuItem('Dashboard v3', ['pi', 'pi-circle-on'], '../../index3.html'))

const kanbanBoard = new MenuItem('Kanban Board', ['pi', 'pi-clone'], '../kanban.html')

const menuItems = ref([dashboard, widgets, calendar, kanbanBoard])

// console.log('X', JSON.stringify(menuItems, undefined, ' '))

</script>
