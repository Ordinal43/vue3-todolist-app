export const useMethodFormRules = () => {
  const ruleRequired = (value) => {
    if (value) return true
    return `Field is required.`
  }

  const ruleMaxLen = (value, maxLen) => {
    if ((value || '').length <= maxLen) return true
    return `Field is maximum ${maxLen} characters.`
  }

  return {
    ruleRequired,
    ruleMaxLen,
  }
}
