import { useCallback, useContext, useEffect } from "react"
import { AutoCompleteContext } from "../components/autocomplete"


type QueryFn<T = any> = (query: string) => Promise<T[]>

type UseAutoCompleteArgs = {
  pagination?: number | null,
  retries?: number,
  onError?: (err: unknown) => void,
}

export const useAutoComplete = (queryFn: QueryFn, args: UseAutoCompleteArgs = {}) => {
  const {
    onError = () => { }
  } = args

  const { query, data, setData } = useContext(AutoCompleteContext)
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
