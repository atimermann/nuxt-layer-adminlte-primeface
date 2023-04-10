<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="../../index3.html" class="brand-link">
      <img
        :src="defaultLogoPath"
        alt="AdminLTE Logo"
        class="brand-image img-circle elevation-3"
        style="opacity: .8"
      >

      <span class="brand-text font-weight-light">AdminLTE 3</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <slot />
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script setup>

const { template } = useAppConfig()

console.log('template.logoPath', template.logoPath)

// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const defaultLogoPath = (template.logoPath === 'DEFAULT')
  ? (await import('@assets/adminlte/img/AdminLTELogo.png')).default
  : template.logoPath

</script>
