import { ref } from 'vue'

export const useStateTaskForm = () => {
  const showTaskForm = ref(false)

  const openTaskForm = () => {
    showTaskForm.value = true
  }

  return {
    showTaskForm,
    openTaskForm,
  }
}
