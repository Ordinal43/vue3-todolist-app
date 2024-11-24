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
        <v-icon :icon="item.meta.icon"></v-icon>
      </template>

      <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
      <template #append>
        <v-badge
          v-show="getAmount(item.name) > 0 && item.name !== ROUTE_NAME_FINISHED"
          :content="getAmount(item.name)"
          v-bind="getProps(item.name)"
          inline
        >
        </v-badge>
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
import {
  ROUTE_NAME_TODAY,
  ROUTE_NAME_UPCOMING,
  ROUTE_NAME_FINISHED,
} from '@/constants'

const routes = computed(() => {
  return useRouter().getRoutes()
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

const getAmount = (routeName) => {
  switch (routeName) {
    case ROUTE_NAME_TODAY:
      return amountTasksTodayAndOverdue.value
    case ROUTE_NAME_UPCOMING:
      return amountTasksUpcoming.value
    case ROUTE_NAME_FINISHED:
      return amountTasksCompleted.value
  }
}
const getProps = (routeName) => {
  switch (routeName) {
    case ROUTE_NAME_TODAY:
      return {
        color: 'red',
      }
    case ROUTE_NAME_UPCOMING:
      return {
        color: 'info',
      }
    case ROUTE_NAME_FINISHED:
      return {
        color: '',
      }
  }
}
</script>
