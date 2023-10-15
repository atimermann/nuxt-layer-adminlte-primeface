<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4 side">
    <!-- Brand Logo -->
    <a href="#" class="brand-link">
      <img
        :src="defaultLogoPath"
        alt="AdminLTE Logo"
        class="brand-image img-circle elevation-3"
        style="opacity: .8"
      >

      <span class="brand-text font-weight-light">{{ template.logoLabel }}</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <slot />
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script setup>

import { useAppConfig } from '#imports'

const { template } = useAppConfig()

const defaultLogoPath = (template.logoPath === 'DEFAULT')
  ? (await import('@assets/adminlte/img/AdminLTELogo.png')).default
  : template.logoPath

</script>
