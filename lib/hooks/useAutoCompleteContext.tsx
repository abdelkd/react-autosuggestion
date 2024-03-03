import { useContext } from "react"
import { AutoCompleteContext, IAutoCompleteContext } from "../main"


export const useAutoCompleteContext = <T,>() => {
  return useContext<IAutoCompleteContext<T>>(AutoCompleteContext)
}
