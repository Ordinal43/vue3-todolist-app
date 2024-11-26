import { ref } from 'vue'

export const useStateTimePicker = () => {
  const menuTimePicker = ref(false)
  const time = ref(null)

  return {
    menuTimePicker,
    time,
  }
}
