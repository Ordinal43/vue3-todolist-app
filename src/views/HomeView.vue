<template>
  <v-row>
    <v-col cols="12">
      <TaskList :tasks="getTasksOverdue">
        <template #header> Overdue </template>
      </TaskList>
    </v-col>
    <v-col cols="12">
      <TaskList :tasks="getTasksToday">
        <template #header>
          {{ dateAdapter.format(TODAY, 'shortDate') }} - Today -
          {{ dateAdapter.format(TODAY, 'weekday') }}
        </template>
        <template #footer>
          <v-btn
            :prepend-icon="mdiPlusCircle"
            :disabled="showTaskForm"
            @click="openTaskForm"
            color="primary"
          >
            Add task
          </v-btn>
        </template>
      </TaskList>
    </v-col>
  </v-row>
  <TaskForm v-model="showTaskForm" />
</template>

<script setup>
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { mdiPlusCircle } from '@mdi/js'
import { computed, ref } from 'vue'
import { useDate } from 'vuetify/lib/framework.mjs'

const dateAdapter = useDate()
const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

// task store logic
const store = useTaskStore()
const getTasksToday = computed(() => {
  return store.getTasksToday()
})
const getTasksOverdue = computed(() => {
  return store.getTasksOverdue()
})

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}
</script>
