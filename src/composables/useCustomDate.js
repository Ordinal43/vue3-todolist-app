export const useCustomDate = () => {
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  return {
    todayMidnight,
  }
}
