<template>
  <v-row>
    <v-col cols="12" v-show="getTasksCompleted.length === 0">
      <NoTask>No finished tasks yet...</NoTask>
    </v-col>
    <v-col cols="12" v-show="getTasksCompleted.length">
      <TaskList :tasks="getTasksCompleted">
        <template #header> Done </template>
      </TaskList>
    </v-col>
  </v-row>
</template>

<script setup>
import NoTask from '@/components/NoTask.vue'
import TaskList from '@/components/TaskList.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { computed } from 'vue'

// task store logic
const store = useTaskStore()
const getTasksCompleted = computed(() => {
  return store.getTasksCompleted()
})
</script>
