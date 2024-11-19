<template>
  <h3>Today's task</h3>
  <v-card v-for="task in tasks" :key="task.key" :title="task.name">
    <v-card-subtitle>
      {{ task.date }}
    </v-card-subtitle>
    <v-card-text>
      {{ task.desc }}
    </v-card-text>
    <template #append>
      <v-btn
        @click="deleteTask(task.key)"
        density="compact"
        :icon="mdiTrashCan"
        color="error"
      ></v-btn>
    </template>
  </v-card>
</template>

<script setup>
import { useTasksStore } from '@/stores/useTasksStore'
import { mdiTrashCan } from '@mdi/js'
import { computed } from 'vue'
import { useDate } from 'vuetify/lib/framework.mjs'

const dateAdapter = useDate()

const tasksStore = useTasksStore()

const tasks = computed(() => {
  return Array.from(tasksStore.tasks).map(([key, value]) => ({
    key,
    ...value,
    date: dateAdapter.format(value.date, 'fullDateWithWeekday'),
  }))
})

const deleteTask = (key) => {
  tasksStore.deleteTask(key)
}
</script>
