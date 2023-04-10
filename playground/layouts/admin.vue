<template>
  <AdminLayout>
    <template #footer>
      <div class="float-right d-none d-sm-block">
        <div class="user-panel">
          <img
            src="@assets/adminlte/img/user2-160x160.jpg"
            class="img-circle elevation-2"
            alt="User Image"
          >
          <b>Version</b> 3.2.0
        </div>
      </div>
      <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
    </template>
  </AdminLayout>
</template>

<script setup>

// import { AdminLayout } from '@agtm/nuxt-layer-adminlite-primeface'
import { AdminLayout } from '../..'

</script>
