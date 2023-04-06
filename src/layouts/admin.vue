<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
          ><i class="fas fa-bars" /></a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="../../index3.html" class="nav-link">Home</a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="#" class="nav-link">Contact</a>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <!-- Navbar Search -->
        <li class="nav-item">
          <a
            class="nav-link"
            data-widget="navbar-search"
            href="#"
            role="button"
          >
            <i class="fas fa-search" />
          </a>
          <div class="navbar-search-block">
            <form class="form-inline">
              <div class="input-group input-group-sm">
                <input
                  class="form-control form-control-navbar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                >
                <div class="input-group-append">
                  <button class="btn btn-navbar" type="submit">
                    <i class="fas fa-search" />
                  </button>
                  <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                    <i class="fas fa-times" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        <!-- Messages Dropdown Menu -->
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="#">
            <i class="far fa-comments" />
            <span class="badge badge-danger navbar-badge">3</span>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" class="dropdown-item">
              <!-- Message Start -->
              <div class="media">
                <img
                  src="../assets/adminlte/img/user1-128x128.jpg"
                  alt="User Avatar"
                  class="img-size-50 mr-3 img-circle"
                >
                <div class="media-body">
                  <h3 class="dropdown-item-title">
                    Brad Diesel
                    <span class="float-right text-sm text-danger"><i class="fas fa-star" /></span>
                  </h3>
                  <p class="text-sm">Call me whenever you can...</p>
                  <p class="text-sm text-muted"><i class="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
              <!-- Message End -->
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <!-- Message Start -->
              <div class="media">
                <img
                  src="../assets/adminlte/img/user8-128x128.jpg"
                  alt="User Avatar"
                  class="img-size-50 img-circle mr-3"
                >
                <div class="media-body">
                  <h3 class="dropdown-item-title">
                    John Pierce
                    <span class="float-right text-sm text-muted"><i class="fas fa-star" /></span>
                  </h3>
                  <p class="text-sm">I got your message bro</p>
                  <p class="text-sm text-muted"><i class="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
              <!-- Message End -->
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <!-- Message Start -->
              <div class="media">
                <img
                  src="../assets/adminlte/img/user3-128x128.jpg"
                  alt="User Avatar"
                  class="img-size-50 img-circle mr-3"
                >
                <div class="media-body">
                  <h3 class="dropdown-item-title">
                    Nora Silvester
                    <span class="float-right text-sm text-warning"><i class="fas fa-star" /></span>
                  </h3>
                  <p class="text-sm">The subject goes here</p>
                  <p class="text-sm text-muted"><i class="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
              <!-- Message End -->
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
          </div>
        </li>
        <!-- Notifications Dropdown Menu -->
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="#">
            <i class="far fa-bell" />
            <span class="badge badge-warning navbar-badge">15</span>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span class="dropdown-item dropdown-header">15 Notifications</span>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-envelope mr-2" /> 4 new messages
              <span class="float-right text-muted text-sm">3 mins</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-users mr-2" /> 8 friend requests
              <span class="float-right text-muted text-sm">12 hours</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-file mr-2" /> 3 new reports
              <span class="float-right text-muted text-sm">2 days</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
          </div>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i class="fas fa-expand-arrows-alt" />
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-widget="control-sidebar"
            data-slide="true"
            href="#"
            role="button"
          >
            <i class="fas fa-th-large" />
          </a>
        </li>
      </ul>
    </nav>
    <!-- /.navbar -->

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="../../index3.html" class="brand-link">
        <img
          src="../assets/adminlte/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          class="brand-image img-circle elevation-3"
          style="opacity: .8"
        >
        <span class="brand-text font-weight-light">AdminLTE 3</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar user (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
            <img src="../assets/adminlte/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
          </div>
          <div class="info">
            <a href="#" class="d-block">Alexander Pierce</a>
          </div>
        </div>

        <!-- SidebarSearch Form -->
        <div class="form-inline">
          <div class="input-group" data-widget="sidebar-search">
            <input
              class="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            >
            <div class="input-group-append">
              <button class="btn btn-sidebar">
                <i class="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <side-bar-menu :menu-items="menuItems" />
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1>Blank Page</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li class="breadcrumb-item active">
                  Blank Page
                </li>
              </ol>
            </div>
          </div>
        </div><!-- /.container-fluid -->
      </section>

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

import SideBarMenu from '../components/SideBarMenu.vue'

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
