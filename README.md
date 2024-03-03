

# React Suggestion

Build fast and performant React autocomplete components with this library. Features include asynchronous data fetching and optimizations for large datasets.

# Features
- type safe
- high performance with large datasets
- ease of use


## Installation
```bash
npm i @abdelkd/react-suggestion
```

## 🚀 Quick Start
```typescript
import {
  AutoSuggestion
  AutoSuggestionInput
  AutoSuggestionList
} from '@abdelkd/react-suggestion';

// an async function takes a string which is the user search keyword
const fakeQueryFn = async (q: string) => {
  const data = new Array(20).fill(null).map((_, i) => i)
  const res = data.filter(item => item < Number(query))

  return res // return an array of the  result
}

const Search = () => {
  return <AutoSuggestion>
    <AutoSuggestionInput />
    <AutoSuggestionList
      queryFn={fakeQueryFn} // pass the asynchronous function
      renderItem={({ item }) => <p>{item}</p>} // how to render each item in the list
      itemSize={20} // Size of each item on the  list
    />
  </AutoSuggestion>
}
```
