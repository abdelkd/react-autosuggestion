import { useContext, useEffect, useState } from "react"
import { AutoCompleteContext } from "../components/autocomplete"


type QueryFn<T> = (query: string) => Promise<T[]>

type UseAutoCompleteArgs = {
  pagination?: number | null,
  retries?: number,
  onError?: () => void,
}

export const useAutoComplete = <T,>(queryFn: QueryFn<T>, args: UseAutoCompleteArgs = {}) => {
  const {} = args

  const [data, setData] = useState<T[]>([])

  const { query } = useContext(AutoCompleteContext)

  useEffect(() => {

    (async() => {
      if(query) {
        let res = await queryFn(query)
        setData(res)
      }
      setData([])
    })()

    console.log('updated the data from context', query, data)

  }, [query])

  return data
}
