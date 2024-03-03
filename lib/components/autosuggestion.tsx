import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState, HTMLAttributes } from "react"
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import { useDebounce } from "../hooks/useDebounce";
import { useAutoSuggestion } from "../hooks/useAutoSuggestion";
import { useAutoSuggestionContext } from "../hooks/useAutoSuggestionContext";
import { cn } from "../utils/cn";

interface AutoSuggestionRootProps {
  children: React.ReactNode,
}

interface AutoSuggestionInputProps extends HTMLAttributes<HTMLInputElement> {
  timeout?: number
}

export type AutoSuggestionRowProps<T extends (args: any) => any> = ListChildComponentProps<Awaited<ReturnType<T>>>

interface AutoSuggestionListProps<T> extends HTMLAttributes<ScrollArea.ScrollAreaProps> {
  queryFn: (q: string) => Promise<T[]>
  onError?: (err: unknown) => void
  renderItem: ({ item }: { item: T }) => React.ReactNode
  itemSize: number
}

export interface IAutoSuggestionContext<T> {
  query: string | null,
  setQuery: Dispatch<SetStateAction<string | null>>;
  setData: Dispatch<SetStateAction<T[] | null>>;
  data: T[] | null;
}

export const AutoSuggestionContext = createContext<IAutoSuggestionContext<any>>({
  query: null,
  setQuery: () => { },
  setData: () => { },
  data: null,
})

const AutoSuggestion = (props: AutoSuggestionRootProps) => {
  const { children } = props

  return <>
    {children}
  </>
}

const AutoSuggestionInput = (props: AutoSuggestionInputProps) => {
  const { timeout, className } = props

  const { query, setQuery } = useContext(AutoSuggestionContext)

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
    <input className={cn(
      "w-[220px] flex h-9 rounded-md border border-gray-100 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )} value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
  </>
}

const AutoSuggestionList = <T,>(props: AutoSuggestionListProps<T>) => {
  const {
    queryFn,
    renderItem,
    onError,
    className,
    itemSize } = props

  const { data, setData } = useAutoSuggestionContext<T>()
  const initialData = useAutoSuggestion(queryFn, { onError })

  useEffect(() => {
    setData(initialData)
  }, [])

  if (!data || data.length === 0) return null

  return <>
    {<ScrollArea.Root className={cn("w-[220px] h-[300px] px-3 rounded-md overflow-hidden bg-transparent border border-gray-100 shadow bt-0 rounded-t-none", className)} >
      <ScrollArea.Viewport className="w-full h-full">
        <FixedSizeList
          itemCount={data.length ?? 7}
          itemSize={itemSize}
          width={220}
          height={300}
          itemData={data}
        >
          {
            ({ data, index, style }: ListChildComponentProps<Awaited<ReturnType<typeof queryFn>>>) => {
              return <div style={style} className="translate-y-1/2 -top-1/2">
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

const withAutoSuggestion = <P extends {}, T>(Component: React.ComponentType<P>) => {

  return function(props: P) {
    const [query, setQuery] = useState<string | null>(null)

    const [data, setData] = useState<T[] | null>(null)

    const context = {
      query,
      setQuery,
      setData,
      data,
      onError: () => { },
    } as IAutoSuggestionContext<T>

    return <AutoSuggestionContext.Provider value={context}>
      <Component {...props} />
    </AutoSuggestionContext.Provider>
  }
}

export {
  withAutoSuggestion,
  AutoSuggestion,
  AutoSuggestionInput,
  AutoSuggestionList
}
