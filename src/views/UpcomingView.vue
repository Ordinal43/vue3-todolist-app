<template>
  <v-row>
    <v-col cols="12">
      <TaskList :tasks="getTasksUpcoming">
        <template #header> Upcoming </template>
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
const getTasksUpcoming = computed(() => {
  return taskStore.getTasksUpcoming()
})
</script>
