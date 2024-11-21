<template>
  <div v-show="tasksOverdue.length">
    <h5>Overdue</h5>
    <TaskList :tasks="tasksOverdue" />
  </div>
  <div v-show="tasksToday.length">
    <h5>
      {{ dateAdapter.format(TODAY, 'shortDate') }} - Today -
      {{ dateAdapter.format(TODAY, 'weekday') }}
    </h5>
    <TaskList :tasks="tasksToday" />
  </div>
  <v-btn
    :prepend-icon="mdiPlusCircle"
    @click="showTaskForm = true"
    color="primary"
    variant="text"
  >
    Add task
  </v-btn>
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
const taskStore = useTaskStore()

const tasks = computed(() => {
  return Array.from(taskStore.tasks).map(([key, value]) => ({
    key,
    ...value,
  }))
})

const tasksOverdue = computed(() => {
  return tasks.value.filter((task) => {
    return dateAdapter.isBefore(new Date(task.date), TODAY)
  })
})

const tasksToday = computed(() => {
  return tasks.value.filter((task) => {
    return dateAdapter.isSameDay(new Date(task.date), TODAY)
  })
})

// TaskForm logic
const showTaskForm = ref(false)
</script>
