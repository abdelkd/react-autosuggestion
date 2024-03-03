import {
  AutoSuggestion,
  AutoSuggestionInput,
  AutoSuggestionList,
  withAutoSuggestion
} from "../lib/components/autosuggestion"

const fakeQueryFn = async (query: string) => {
  const data = new Array(50000).fill(null).map((_, i) => i)
  const res = data.filter(item => item < Number(query))

  return res
}

function App() {

  return (
    <div>
      <AutoSuggestion>
        <AutoSuggestionInput />
        <AutoSuggestionList
          queryFn={fakeQueryFn}
          renderItem={({ item }) => <p className="border-b">{item}</p>}
          itemSize={30}
        />
      </AutoSuggestion>
    </div>
  )
}

export default withAutoSuggestion(App)
