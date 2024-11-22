<template>
  <v-row>
    <v-col cols="12" v-show="tasksDone.length === 0">
      <NoTask />
    </v-col>
    <v-col cols="12" v-show="tasksDone.length">
      <TaskList :tasks="tasksDone">
        <template #header> Done </template>
      </TaskList>
    </v-col>
  </v-row>
</template>

<script setup>
import NoTask from '@/components/NoTask.vue';
import TaskList from '@/components/TaskList.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { computed } from 'vue'

// task store logic
const taskStore = useTaskStore()

const tasks = computed(() => {
  return Array.from(taskStore.tasks).map(([key, value]) => ({
    key,
    ...value,
  }))
})

const tasksDone = computed(() => {
  return tasks.value.filter((task) => {
    return task.isComplete
  })
})
</script>
