import { ref } from 'vue'
import { useDate } from 'vuetify'

export const useDatePicker = () => {
  const dateAdapter = useDate()
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const minDate = ref(currentDate)
  const menuDatePicker = ref(false)

  const formatDate = (dateValue) => {
    return dateAdapter.format(dateValue, 'normalDateWithWeekday')
  }

  const setDateAndClose = (callback) => {
    callback()
    menuDatePicker.value = false
  }

  return {
    currentDate,
    minDate,
    menuDatePicker,
    formatDate,
    setDateAndClose,
  }
}
