<template>
  <v-row>
    <v-col cols="12" v-show="tasksUpcoming.length === 0">
      <NoTask />
    </v-col>
    <v-col cols="12" v-show="tasksUpcoming.length">
      <TaskList :tasks="tasksUpcoming">
        <template #header> Upcoming </template>
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

const tasksUpcoming = computed(() => {
  return tasks.value.filter((task) => {
    return (
      dateAdapter.isAfterDay(new Date(task.date), TODAY) && !task.isComplete
    )
  })
})

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}
</script>
