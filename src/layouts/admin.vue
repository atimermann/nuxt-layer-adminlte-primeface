<template>
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
      <SidebarUser />
      <SidebarSearch />
      <side-bar-menu :menu-items="menuItems" />
    </MainSidebar>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <ContentHeader />

      <!-- Main content -->
      <section class="content">
        <!-- Default box -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              Title
            </h3>

            <div class="card-tools">
              <button
                  type="button"
                  class="btn btn-tool"
                  data-card-widget="collapse"
                  title="Collapse"
              >
                <i class="fas fa-minus" />
              </button>
              <button
                  type="button"
                  class="btn btn-tool"
                  data-card-widget="remove"
                  title="Remove"
              >
                <i class="fas fa-times" />
              </button>
            </div>
          </div>
          <div class="card-body">
            <nuxt-page />
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
            Footer
          </div>
          <!-- /.card-footer-->
        </div>
        <!-- /.card -->
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <footer class="main-footer">
      <div class="float-right d-none d-sm-block">
        <b>Version</b> 3.2.0
      </div>
      <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
    </footer>

    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
      <!-- Control sidebar content goes here -->
    </aside>
    <!-- /.control-sidebar -->
  </div>
</template>

<script setup>

import { ref } from 'vue'

import SideBarMenu from '../components/admin/SideBarMenu.vue'
import TopNavbar from "../components/admin/TopNavbar.vue";
import RightNavbarLinks from "../components/admin/RightNavbarLinks.vue";
import MainSidebar from "../components/admin/MainSidebar.vue";
import SidebarUser from "../components/admin/SidebarUser.vue";
import SidebarSearch from "../components/admin/SidebarSearch.vue";
import ContentHeader from "../components/admin/ContentHeader.vue";

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

// const menuItems = ref([
//   {
//     title: 'Dashboard',
//     iconClasses: ['pi', 'pi-home'],
//     link: '#',
//     subItems: [
//       {
//         title: 'Dashboard v1',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index.html'
//       },
//       {
//         title: 'Dashboard v2',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index2.html'
//       },
//       {
//         title: 'Dashboard v3',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index3.html'
//       }
//     ]
//   },
//   {
//     title: 'Widgets',
//     iconClasses: ['pi', 'pi-calculator'],
//     link: '../widgets.html',
//     badge: 'New',
//     badgeClasses: ['badge-danger'],
//     subItems: [
//       {
//         title: 'Dashboard v1',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index.html'
//       },
//       {
//         title: 'Dashboard v2',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index2.html'
//       },
//       {
//         title: 'Dashboard v3',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index3.html'
//       }
//     ]
//   },
//   {
//     title: 'Calendar',
//     iconClasses: ['pi', 'pi-calendar'],
//     link: '../calendar.html',
//     badge: '2',
//     badgeClasses: ['badge-info'],
//     subItems: [
//       {
//         title: 'Dashboard v1',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index.html'
//       },
//       {
//         title: 'Dashboard v2',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index2.html'
//       },
//       {
//         title: 'Dashboard v3',
//         iconClasses: ['pi', 'pi-circle-on'],
//         link: '../../index3.html'
//       }
//     ]
//   },
//   {
//     title: 'Kanban Board',
//     iconClasses: ['pi', 'pi-clone'],
//     link: '../kanban.html'
//   }
// ]);

</script>
