<template>
  <v-list lines="two">
    <v-list-item v-for="task in tasks" :key="task.key" :title="task.name">
      <v-card-subtitle>
        {{ dateAdapter.format(task.date, 'fullDateWithWeekday') }}
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
</template>

<script setup>
import { mdiTrashCan } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDate } from 'vuetify/lib/framework.mjs'

const dateAdapter = useDate()
const taskStore = useTaskStore()

defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

const deleteTask = (key) => {
  taskStore.deleteTask(key)
}
</script>
