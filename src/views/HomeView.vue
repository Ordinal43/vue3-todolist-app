<template>
  <v-row>
    <v-col cols="12" v-show="tasksToday.length + tasksOverdue.length === 0">
      <NoTask />
    </v-col>
    <v-col cols="12" v-show="tasksOverdue.length">
      <TaskList :tasks="tasksOverdue">
        <template #header> Overdue </template>
      </TaskList>
    </v-col>
    <v-col cols="12" v-show="tasksToday.length">
      <TaskList :tasks="tasksToday">
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
import NoTask from '@/components/NoTask.vue'
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
    return dateAdapter.isBefore(new Date(task.date), TODAY) && !task.isComplete
  })
})

const tasksToday = computed(() => {
  return tasks.value.filter((task) => {
    return dateAdapter.isSameDay(new Date(task.date), TODAY) && !task.isComplete
  })
})

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}
</script>
