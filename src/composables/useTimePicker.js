import { ref } from 'vue'

export const useTimePicker = () => {
  const menuTimePicker = ref(false)
  const time = ref(null)

  const resetTimePicker = () => {
    time.value = null
  }

  const closeTimePicker = () => {
    menuTimePicker.value = false
  }

  return {
    menuTimePicker,
    time,
    resetTimePicker,
    closeTimePicker,
  }
}
