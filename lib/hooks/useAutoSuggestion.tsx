import { useCallback, useContext, useEffect } from "react"
import { AutoSuggestionContext } from "../components/autosuggestion"


type QueryFn<T = any> = (query: string) => Promise<T[]>

type UseAutoSuggestionArgs = {
  pagination?: number | null,
  retries?: number,
  onError?: (err: unknown) => void,
}

export const useAutoSuggestion = (queryFn: QueryFn, args: UseAutoSuggestionArgs = {}) => {
  const {
    onError = () => { }
  } = args

  const { query, data, setData } = useContext(AutoSuggestionContext)
  const fetchData = useCallback(() => {
    (async () => {
      if (!query) {
        return setData([])
      }

      try {
        let res = await queryFn(query)
        setData(res)
      } catch (error) {
        onError(error)
      }
    })()

  }, [query])

  useEffect(() => {
    fetchData()
  }, [query])

  return data
}
