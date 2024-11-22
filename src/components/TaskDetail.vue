<template>
  <v-dialog v-model="show" maxWidth="850">
    <v-card v-if="getTaskDetails">
      <v-card-title class="d-flex">
        <v-spacer></v-spacer>
        <v-btn
          @click="closeForm"
          :icon="mdiClose"
          density="compact"
          variant="text"
        >
        </v-btn>
      </v-card-title>
      <v-card-text>
        <h4>{{ getTaskDetails.name }}</h4>
        <v-divider class="my-2"></v-divider>
        <p>{{ getTaskDetails.desc }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-card> </v-card>
</template>

<script setup>
import { useTaskStore } from '@/stores/useTaskStore'
import { mdiClose } from '@mdi/js'
import { computed } from 'vue'

// dialog logic
const show = defineModel()
const closeForm = () => {
  show.value = false
}

const taskStore = useTaskStore()
const getTaskDetails = computed(() => {
  return taskStore.tasks.get(taskStore.activeKey)
})
</script>
