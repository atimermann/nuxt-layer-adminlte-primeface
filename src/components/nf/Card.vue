<template>
  <div class="card" :class="cardClass">
    <div class="card-header">
      <div v-if="$slots.title" class="card-title ">
        <slot name="title" />
      </div>
      <div v-if="$slots.tools" class="card-tools">
        <slot name="tools" />
      </div>
    </div>
    <!-- /.card-header -->
    <div class="card-body">
      <slot name="content" />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
    <!-- /.card-body -->
    <div
      v-if="$slots.overlay"
      v-show="overlay"
      class="overlay"
      :class="overlay"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  type: {
    type: String,
    default: null,
    validator: value => {
      const validValues = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark']

      if (!validValues.includes(value)) {
        console.error(`Type must be one of the following values: ${validValues.join(', ')}`)
        return false
      }

      return true
    }
  },
  outline: {
    type: Boolean,
    default: false
  },
  bg: {
    type: String,
    default: null,
    validator: value => {
      const validValues = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark', 'gradient-primary', 'gradient-secondary', 'gradient-success', 'gradient-info', 'gradient-warning', 'gradient-danger', 'gradient-dark']

      if (!validValues.includes(value)) {
        console.error(`Type must be one of the following values: ${validValues.join(', ')}`)
        return false
      }

      return true
    }
  },
  overlay: {
    type: String,
    default: null,
    validator: value => {
      const validValues = ['dark', 'light']

      if (!validValues.includes(value)) {
        console.error(`Type must be one of the following values: ${validValues.join(', ')}`)
        return false
      }

      return true
    }
  }
})

const cardClass = computed({
  get () {
    const classes = []

    if (props.type) {
      classes.push(`card-${props.type}`)
    }
    if (props.bg) {
      classes.push(`bg-${props.bg}`)
    }
    if (props.outline) {
      classes.push('card-outline')
    }
    return classes
  }
})

</script>
