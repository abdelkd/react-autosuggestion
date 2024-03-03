import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import { useDebounce } from "../hooks/useDebounce";
import { useAutoComplete } from "../hooks/useAutoComplete";
import { useAutoCompleteContext } from "../hooks/useAutoCompleteContext";

interface AutoCompleteRootProps {
  children: React.ReactNode,
}

interface AutoCompleteInputProps {
  timeout?: number
}

export type AutoCompleteRowProps<T extends (args: any) => any> = ListChildComponentProps<Awaited<ReturnType<T>>>

type AutoCompleteListProps<T> = {
  queryFn: (q: string) => Promise<T[]>
  renderItem: ({ item }: { item: T }) => React.ReactNode
}

export interface IAutoCompleteContext<T> {
  query: string | null,
  setQuery: Dispatch<SetStateAction<string | null>>;
  setData: Dispatch<SetStateAction<T[] | null>>;
  data: T[] | null;
  onError: () => void;
}

export const AutoCompleteContext = createContext<IAutoCompleteContext<any>>({
  query: null,
  setQuery: () => { },
  setData: () => { },
  data: null,
  onError: () => { },
})

const AutoComplete = (props: AutoCompleteRootProps) => {
  const { children } = props

  return <>
    {children}
  </>
}

const AutoCompleteInput = (props: AutoCompleteInputProps) => {
  const { timeout } = props

  const { query, setQuery } = useContext(AutoCompleteContext)

  const [localQuery, setLocalQuery] = useState(query ?? "")
  const debouncedQuery = useDebounce(localQuery, timeout)

  useEffect(() => {
    if (localQuery === "") {
      setQuery(null)
      return
    }

    setQuery(localQuery)
  }, [debouncedQuery])

  return <>
    <input className="w-[220px] rounded border" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
  </>
}

const AutoCompleteList = <T,>(props: AutoCompleteListProps<T>) => {
  const { queryFn, renderItem } = props

  const { data, setData } = useAutoCompleteContext<T>()
  const initialData = useAutoComplete(queryFn)

  useEffect(() => {
    setData(initialData)
  }, [])

  if (!data || data.length === 0) return null

  return <>
    {<ScrollArea.Root className="w-[220px] h-[300px] rounded-md overflow-hidden bg-gray-100">
      <ScrollArea.Viewport className="w-full h-full">
        <FixedSizeList
          itemCount={data.length ?? 7}
          itemSize={15}
          width={220}
          height={300}
          itemData={data}
        >
          {
            ({ data, index, style }: ListChildComponentProps<Awaited<ReturnType<typeof queryFn>>>) => {
              return <div style={style}>
                {renderItem({ item: data[index] })}
              </div>
            }
          }
        </FixedSizeList>
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

const withAutoComplete = <P extends {}, T>(Component: React.ComponentType<P>) => {

  return function(props: P) {
    const [query, setQuery] = useState<string | null>(null)

    const [data, setData] = useState<T[] | null>(null)

    const context = {
      query,
      setQuery,
      setData,
      data,
      onError: () => { },
    } as IAutoCompleteContext<T>

    return <AutoCompleteContext.Provider value={context}>
      <Component {...props} />
    </AutoCompleteContext.Provider>
  }
}

export {
  withAutoComplete,
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList
}
