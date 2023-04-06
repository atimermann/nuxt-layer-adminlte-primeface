<template>
  GUEST PAGE
</template>

<script setup>

import {ref, onMounted, computed} from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})

// a computed ref
const countPlus = computed(() => {
  return count.value + 1
})

</script>

<style scoped>
</style>
