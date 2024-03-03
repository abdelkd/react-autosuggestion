import { useCallback, useContext, useEffect } from "react"
import { AutoCompleteContext } from "../components/autocomplete"


type QueryFn<T = any> = (query: string) => Promise<T[]>

type UseAutoCompleteArgs = {
  pagination?: number | null,
  retries?: number,
  onError?: () => void,
}

export const useAutoComplete = (queryFn: QueryFn, args: UseAutoCompleteArgs = {}) => {
  const { } = args

  const { query, data, setData } = useContext(AutoCompleteContext)
  const fetchData = useCallback(() => {
    (async () => {
      console.log("doing fetching")
      if (!query) {
        return setData([])
      }

      let res = await queryFn(query)
      setData(res)
    })()

  }, [query])

  useEffect(() => {
    fetchData()
  }, [query])

  return data
}
