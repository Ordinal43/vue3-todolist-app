import { ref } from 'vue'
import { useTaskStore } from '@/stores/useTaskStore'

export const useClearStorage = () => {
  const dialog = ref(false)
  const warningMessage = ref('Are you sure you want to clear the storage?')

  const openDialog = () => {
    dialog.value = true
  }

  const closeDialog = () => {
    dialog.value = false
  }

  const clearStorage = () => {
    const taskStore = useTaskStore()
    taskStore.clearStorage()
    dialog.value = false
  }

  return {
    dialog,
    warningMessage,
    openDialog,
    closeDialog,
    clearStorage,
  }
}
