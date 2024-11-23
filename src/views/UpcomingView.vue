<template>
  <v-row>
    <v-col cols="12">
      <TaskList :tasks="getTasksUpcoming">
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
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { mdiPlusCircle } from '@mdi/js'
import { computed, ref } from 'vue'

// task store logic
const store = useTaskStore()
const getTasksUpcoming = computed(() => {
  return store.getTasksUpcoming()
})

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}
</script>
