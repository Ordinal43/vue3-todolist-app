import { ref } from 'vue'

export const useTaskForm = () => {
  const showTaskForm = ref(false)

  const openTaskForm = () => {
    showTaskForm.value = true
  }

  return {
    showTaskForm,
    openTaskForm,
  }
}
