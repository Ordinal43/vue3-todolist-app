<template>
  <v-img :width="500" cover :src="imgUrl"></v-img>

  <h3 class="mt-5">You have no remaining tasks!</h3>
</template>

<script setup>
import imgUrl from '/public/no_task.svg'
</script>
