import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { useDebounce } from "../hooks/useDebounce";
import { useAutoComplete } from "../hooks/useAutoComplete";

interface AutoCompleteRootProps {
  children: React.ReactNode,
}

interface AutoCompleteInputProps {
  timeout?: number
}

interface AutoCompleteListProps {}

interface AutoCompleteContext<T = any> {
  query: string | null,
  setQuery: Dispatch<SetStateAction<string | null>> 
  data: T[] | null;
  onError: () => void;
}

const AUTOCOMPLETE_CONTEXT: AutoCompleteContext = {
  query: null,
  setQuery: () => {},
  data: null,
  onError: () => {},
}

export const AutoCompleteContext = createContext<AutoCompleteContext>(AUTOCOMPLETE_CONTEXT)

export const AutoCompleteRoot = (props: AutoCompleteRootProps) => {
  const { children } = props
  const [query, setQuery] = useState<string | null>(null)

  const context: AutoCompleteContext = {
    query,
    setQuery,
    data: null,
    onError: () => {}
  }

  return <AutoCompleteContext.Provider value={context}>
    {children}
    <DebugContext />
  </AutoCompleteContext.Provider>
}

export const AutoCompleteInput = (props: AutoCompleteInputProps) => {
  const { timeout } = props

  const { query, setQuery } = useContext(AutoCompleteContext)

  const [localQuery, setLocalQuery] = useState(query)
  const debouncedQuery = useDebounce(localQuery, timeout)

  useEffect(() => {
    console.log('updating state', debouncedQuery, localQuery)

    if (localQuery === "") {
      setQuery(null)
      return
    }

    setQuery(localQuery)
  }, [debouncedQuery])

  return <>
    <p>{localQuery}</p>
    <input className="w-[220px]" value={localQuery as string} onChange={(e) => setLocalQuery(e.target.value)} />
  </>
}

export const AutoCompleteList = (props: AutoCompleteListProps) => {
  const {} = props

  const data = useAutoComplete(fakeQueryFn)

  return <>
    {<ScrollArea.Root className="w-[220px] h-[300px] rounded-md overflow-hidden bg-gray-100">
    <ScrollArea.Viewport className="w-full h-full">
      <div className="p-2">
        {data.map(item => <div key={item} className="py-1">{item}</div>)}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      className="flex select-none touch-none p-0.5"
      orientation="vertical"
    >
      <ScrollArea.Thumb className="flex-1" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
        }
    </>
}

const DebugContext = () => {
  const all = useContext(AutoCompleteContext)
  return <p>{JSON.stringify(all)}</p>
}

const fakeQueryFn = async (query: string) => {
  const data = new Array(50).fill(null).map((_, i) => i)

  const res = data.filter(item => item < Number(query))

  return res
}
