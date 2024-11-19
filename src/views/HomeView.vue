<template>
  <h3>Today's task</h3>
  <v-list lines="two">
    <v-list-item v-for="task in tasks" :key="task.key" :title="task.name">
      <v-card-subtitle>
        {{ task.date }}
      </v-card-subtitle>
      <template #append>
        <v-btn
          @click="deleteTask(task.key)"
          :icon="mdiTrashCan"
          color="error"
          density="compact"
          variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <v-btn
    :prepend-icon="mdiPlusCircle"
    @click="showTaskForm = true"
    color="primary"
    variant="text"
  >
    Add task
  </v-btn>
  <TaskForm v-model="showTaskForm" />
</template>

<script setup>
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import { computed, ref } from 'vue'
import { useDate } from 'vuetify/lib/framework.mjs'

const dateAdapter = useDate()

// task store logic
const taskStore = useTaskStore()

const tasks = computed(() => {
  return Array.from(taskStore.tasks).map(([key, value]) => ({
    key,
    ...value,
    date: dateAdapter.format(value.date, 'fullDateWithWeekday'),
  }))
})

const deleteTask = (key) => {
  taskStore.deleteTask(key)
}

// TaskForm logic
const showTaskForm = ref(false)
</script>
