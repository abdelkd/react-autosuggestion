import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  withAutoComplete
} from "../lib/components/autocomplete"

const fakeQueryFn = async (query: string) => {
  const data = new Array(50000).fill(null).map((_, i) => i)
  const res = data.filter(item => item < Number(query))

  return res
}

function App() {

  return (
    <div>
      <AutoComplete>
        <AutoCompleteInput />
        <AutoCompleteList
          queryFn={fakeQueryFn}
          renderItem={({ item }) => <p>{item}</p>}
        />
      </AutoComplete>
    </div>
  )
}

export default withAutoComplete(App)
