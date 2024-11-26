import { ref } from 'vue'

export const useStateTimePicker = () => {
  const menuTimePicker = ref(false)

  return {
    menuTimePicker,
  }
}
