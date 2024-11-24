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
import { useDate } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/useTaskStore'
import { useCustomDate } from '@/composables/useCustomDate'
import TaskList from '@/components/TaskList.vue'

const dateAdapter = useDate()
const taskStore = useTaskStore()

const { getTasksToday, getTasksOverdue } = storeToRefs(taskStore)
const { todayMidnight } = useCustomDate()
</script>
