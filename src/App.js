import "./App.scss";
import Introduction from "./components/Introduction/Introduction";
import SearchBox from "./components/SearchBox/SearchBox";

function App() {
  return (
    <>
      <Introduction />
      <SearchBox
        containerClasses="center-x"
        inputClasses="searchbar-input"
        placeholder="Enter city name..."
      />
    </>
  );
}

export default App;
