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
    <v-spacer></v-spacer>
    <v-list-item base-color="red" @click="openDialog">
      <template #prepend>
        <v-icon :icon="mdiTrashCan"></v-icon>
      </template>

      <v-list-item-title>Clear item</v-list-item-title>
    </v-list-item>
  </v-list>

  <TaskForm v-model="showTaskForm" variant="dialog" />

  <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-text>
        <h3>{{ warningMessage }}</h3>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog"> cancel </v-btn>
        <v-btn @click="clearStorage"> clear </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useTaskForm } from '@/composables/useTaskForm'
import { useClearStorage } from '@/composables/useClearStorage'
import TaskForm from './TaskForm.vue'
import {
  ROUTE_NAME_TODAY,
  ROUTE_NAME_UPCOMING,
  ROUTE_NAME_FINISHED,
} from '@/constants'

const taskStore = useTaskStore()
const { showTaskForm, openTaskForm } = useTaskForm()
const { dialog, warningMessage, openDialog, closeDialog, clearStorage } =
  useClearStorage()

// route logic
const routes = computed(() => {
  return useRouter().getRoutes()
})

// sidemenu logic
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
