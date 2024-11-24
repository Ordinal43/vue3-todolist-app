<template>
  <v-row>
    <v-col cols="12">
      <TaskList :tasks="getTasksOverdue">
        <template #header> Overdue </template>
      </TaskList>
    </v-col>
    <v-col cols="12">
      <TaskList :tasks="getTasksToday" has-action>
        <template #header>
          {{ dateAdapter.format(todayMidnight, 'shortDate') }} - Today -
          {{ dateAdapter.format(todayMidnight, 'weekday') }}
        </template>
      </TaskList>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useDate } from 'vuetify'
import { useTaskStore } from '@/stores/useTaskStore'
import { useCustomDate } from '@/composables/useCustomDate'
import TaskList from '@/components/TaskList.vue'

const dateAdapter = useDate()
const { todayMidnight } = useCustomDate()

// task store logic
const taskStore = useTaskStore()
const getTasksToday = computed(() => {
  return taskStore.getTasksToday()
})
const getTasksOverdue = computed(() => {
  return taskStore.getTasksOverdue()
})
</script>
