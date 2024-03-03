import { useContext } from "react"
import { AutoSuggestionContext, IAutoSuggestionContext } from "../main"


export const useAutoSuggestionContext = <T,>() => {
  return useContext<IAutoSuggestionContext<T>>(AutoSuggestionContext)
}
