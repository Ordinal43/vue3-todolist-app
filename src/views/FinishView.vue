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
import { computed } from 'vue'
import { useTaskStore } from '@/stores/useTaskStore'
import TaskList from '@/components/TaskList.vue'

// task store logic
const taskStore = useTaskStore()
const getTasksCompleted = computed(() => {
  return taskStore.getTasksCompleted()
})
</script>
