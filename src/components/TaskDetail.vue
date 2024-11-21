<template>
  <v-dialog
    :model-value="show"
    @update:model-value="(value) => (show = value)"
    maxWidth="600"
  >
    <v-card v-if="getTaskDetails">
      <v-card-title>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        {{ getTaskDetails.name }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeForm" text>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card> </v-card>
</template>

<script setup>
import { useTaskStore } from '@/stores/useTaskStore'
import { computed } from 'vue'

// dialog logic
const show = defineModel()
const closeForm = () => {
  show.value = false
}

// task details logic
const { idTask } = defineProps({
  idTask: {
    type: String,
  },
})

const taskStore = useTaskStore()
const getTaskDetails = computed(() => {
  return taskStore.getTask(idTask)
})
</script>
