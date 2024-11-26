export const useStateDates = () => {
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  return {
    todayMidnight,
  }
}
