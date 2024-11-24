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
      <template #append>
        <v-chip variant="outlined" size="x-small">
          {{ getAmount(i) }}
        </v-chip>
      </template>
    </v-list-item>
  </v-list>

  <TaskForm v-model="showTaskForm" variant="dialog" />
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiPlusCircle } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
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

// sidemenu logic
const taskStore = useTaskStore()

const amountTasksTodayAndOverdue = computed(() => {
  return taskStore.getTasksOverdue().length + taskStore.getTasksToday().length
})
const amountTasksUpcoming = computed(() => {
  return taskStore.getTasksUpcoming().length
})
const amountTasksCompleted = computed(() => {
  return taskStore.getTasksCompleted().length
})

const getAmount = (i) => {
  switch (i) {
    case 0:
      return amountTasksTodayAndOverdue
    case 1:
      return amountTasksUpcoming
    case 2:
      return amountTasksCompleted
  }
}
</script>
