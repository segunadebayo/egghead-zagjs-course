import "./App.css";

function App() {
  return (
    <div className="App">
      <div data-part="container">
        <label>Enter verification</label>
        <div data-part="input-group">
          <input data-part="input" />
          <input data-part="input" />
          <input data-part="input" />
          <input data-part="input" />
        </div>
      </div>
    </div>
  );
}

export default App;
