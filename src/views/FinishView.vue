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
import TaskList from '@/components/TaskList.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { computed } from 'vue'

// task store logic
const store = useTaskStore()
const getTasksCompleted = computed(() => {
  return store.getTasksCompleted()
})
</script>
