import { ref } from 'vue'
import { useDate } from 'vuetify'
import { useCustomDate } from './useCustomDate'

export const useDatePicker = () => {
  const dateAdapter = useDate()
  const { todayMidnight } = useCustomDate()

  const minDate = ref(todayMidnight)
  const menuDatePicker = ref(false)

  const formatDate = (dateValue) => {
    return dateAdapter.format(dateValue, 'normalDateWithWeekday')
  }

  const setDateAndClose = (callback) => {
    callback()
    menuDatePicker.value = false
  }

  return {
    minDate,
    menuDatePicker,
    formatDate,
    setDateAndClose,
  }
}
