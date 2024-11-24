<template>
  <v-row>
    <v-col cols="12">
      <TaskList :tasks="getTasksCompleted">
        <template #header> Done </template>
      </TaskList>
    </v-col>
  </v-row>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/useTaskStore'
import TaskList from '@/components/TaskList.vue'

// task store logic
const taskStore = useTaskStore()
const { getTasksCompleted } = storeToRefs(taskStore)
</script>
