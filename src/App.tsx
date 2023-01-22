import "./App.css";
import { usePinInput } from "./use-pin-input";

function App() {
  const { getInputProps, getLabelProps, getHiddenInputProps, value } =
    usePinInput({
      numOfFields: 4,
      name: "pincode",
      onComplete(value) {
        console.log({ value });
      },
    });

  return (
    <div className="App">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          console.log(formData.get("pincode"));
        }}
      >
        <div data-part="container">
          <label {...getLabelProps()}>Enter verification</label>
          <input {...getHiddenInputProps()} />
          <div data-part="input-group">
            {value.map((_, index) => (
              <input key={index} {...getInputProps({ index })} />
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function stringify(state: Record<string, any>) {
  const { value, event, context } = state;
  return JSON.stringify({ state: value, event, context }, null, 2);
}

export default App;
