<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link"
          data-widget="pushmenu"
          href="#"
          role="button"
          @click="colapseMenu"
        ><i class="pi pi-bars" /></a>
      </li>
      <!--      <li class="nav-item d-none d-sm-inline-block">-->
      <!--        <a href="../../index3.html" class="nav-link">Home</a>-->
      <!--      </li>-->
      <!--      <li class="nav-item d-none d-sm-inline-block">-->
      <!--        <a href="#" class="nav-link">Contact</a>-->
      <!--      </li>-->
    </ul>

    <!-- Right navbar links -->
    <slot />
  </nav>
</template>

<script setup>

import { inject } from '#imports'

const colapseMenu = inject('colapseMenu')

</script>
