import { ref } from 'vue'

export const useTimePicker = () => {
  const menuTimePicker = ref(false)
  const time = ref(null)
  return {
    menuTimePicker,
    time,
  }
}
