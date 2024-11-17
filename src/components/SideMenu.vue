<template>
  <v-list>
    <v-list-item
      link
      v-for="(item, i) in routes"
      :key="`route-${i}`"
      :value="item"
      :to="item.path"
      color="primary"
      variant="plain"
    >
      <template #prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>

      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const routes = computed(() => {
  return useRouter()
    .getRoutes()
    .map((item) => ({
      path: item.path,
      title: item.meta.title,
      icon: item.meta.icon,
    }))
})
</script>
