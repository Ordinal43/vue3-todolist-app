<template>
  <v-card>
    <v-list lines="three">
      <v-list-item
        v-for="task in tasks"
        :key="task.key"
        :title="task.name"
        @click="openTaskDetail(task.key)"
      >
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
  </v-card>

  <TaskDetail v-model="showTaskDetail" :id-task="idTask" />
</template>

<script setup>
import { mdiTrashCan } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDate } from 'vuetify/lib/framework.mjs'
import TaskDetail from './TaskDetail.vue'
import { ref } from 'vue'

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

// TaskDetail logic
const showTaskDetail = ref(false)
const idTask = ref(null)
const openTaskDetail = (key) => {
  idTask.value = key
  showTaskDetail.value = true
}
</script>
