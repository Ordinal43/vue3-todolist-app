<template>
  <v-img :width="500" cover :src="imgUrl"></v-img>

  <h3 class="mt-5" v-if="$slots.default">
    <slot></slot>
  </h3>
</template>

<script setup>
import imgUrl from '@/assets/no_task.svg'
</script>
