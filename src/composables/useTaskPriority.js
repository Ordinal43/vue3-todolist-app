import { ref } from 'vue'

export const useTaskPriority = () => {
  const menuPriority = ref(false)
  const priorityOptions = [
    { value: 1, color: 'red' },
    { value: 2, color: 'yellow' },
    { value: 3, color: 'blue' },
    { value: 4, color: 'grey' },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'red'
      case 2:
        return 'yellow'
      case 3:
        return 'blue'
      default:
        return 'grey'
    }
  }

  return {
    menuPriority,
    priorityOptions,
    getPriorityColor,
  }
}
