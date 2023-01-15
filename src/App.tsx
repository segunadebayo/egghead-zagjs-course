import { useMachine } from "@zag-js/react";
import "./App.css";
import { machine } from "./machine";

const inputs = [...Array.from({ length: 4 }).keys()];

function App() {
  const [state, send] = useMachine(machine);
  const { value } = state.context;

  return (
    <div className="App">
      <div data-part="container">
        <label>Enter verification</label>
        <div data-part="input-group">
          {inputs.map((index) => (
            <input
              key={index}
              data-part="input"
              value={value[index]}
              onChange={(event) => {
                const { value } = event.target;
                send({ type: "INPUT", index, value });
              }}
              onFocus={() => {
                send({ type: "FOCUS", index });
              }}
              onBlur={() => {
                send({ type: "BLUR" });
              }}
              onKeyDown={(event) => {
                const { key } = event;
                if (key === "Backspace") {
                  send({ type: "BACKSPACE", index });
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
                const value = event.clipboardData.getData("Text").trim();
                send({ type: "PASTE", value, index });
              }}
            />
          ))}
        </div>
      </div>
      <pre>{stringify(state)}</pre>
    </div>
  );
}

function stringify(state: Record<string, any>) {
  const { value, event, context } = state;
  return JSON.stringify({ state: value, event, context }, null, 2);
}

export default App;
