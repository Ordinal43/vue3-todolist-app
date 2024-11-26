import { useDate } from 'vuetify'

export const useMethodDateFormatter = () => {
  const dateAdapter = useDate()
  const formatDate = (dateValue) => {
    return dateAdapter.format(dateValue, 'shortDate')
  }

  const formatTime = (time) => {
    // replace this with AM PM later!
    if (time !== null) {
      return time
    }
    return ''
  }

  return {
    formatDate,
    formatTime,
  }
}
