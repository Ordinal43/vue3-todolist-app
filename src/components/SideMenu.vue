<template>
  <v-list nav>
    <v-list-item color="red" @click="openTaskForm">
      <template #prepend>
        <v-icon :icon="mdiPlusCircle"></v-icon>
      </template>
      <v-list-item-title>Add task</v-list-item-title>
    </v-list-item>
  </v-list>
  <v-divider />
  <v-list nav density="compact">
    <v-list-item
      link
      v-for="(item, i) in routes"
      :key="`route-${i}`"
      :to="item.path"
    >
      <template #prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>

      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>

  <TaskForm v-model="showTaskForm" variant="dialog" />
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiPlusCircle } from '@mdi/js'
import TaskForm from './TaskForm.vue'

const routes = computed(() => {
  return useRouter()
    .getRoutes()
    .map((item) => ({
      path: item.path,
      title: item.meta.title,
      icon: item.meta.icon,
    }))
})

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}
</script>
