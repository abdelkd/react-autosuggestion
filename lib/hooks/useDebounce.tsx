import { useEffect, useState } from "react"


export const useDebounce = <T,>(initialValue: T, duration = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(initialValue), duration)

    return () => {
      clearTimeout(timeout)
    }
  }, [initialValue, duration])

  return debouncedValue
}
