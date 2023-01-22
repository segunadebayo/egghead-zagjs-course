import { useMachine } from "@zag-js/react";
import { ComponentProps } from "react";
import { machine, MachineOptions } from "./machine";

type LabelProps = ComponentProps<"label"> & { "data-part": string };
type InputProps = ComponentProps<"input"> & { "data-part": string };

export function usePinInput(options: MachineOptions) {
  const [state, send] = useMachine(machine(options));

  const value = state.context.value;
  const valueAsString = value.join("");

  const name = state.context.name;

  return {
    value,
    valueAsString,

    getLabelProps(): LabelProps {
      return {
        "data-part": "label",
        onClick() {
          send({ type: "LABEL_CLICK" });
        },
      };
    },
    getHiddenInputProps(): InputProps {
      return {
        "data-part": "hidden-input",
        name,
        type: "hidden",
        value: value.join(""),
      };
    },
    getInputProps({ index }: { index: number }): InputProps {
      return {
        "data-part": "input",
        maxLength: 2,
        value: value[index],
        onChange(event) {
          const { value } = event.target;
          send({ type: "INPUT", index, value });
        },
        onFocus() {
          send({ type: "FOCUS", index });
        },
        onBlur() {
          send({ type: "BLUR" });
        },
        onKeyDown(event) {
          const { key } = event;
          if (key === "Backspace") {
            send({ type: "BACKSPACE", index });
          }
        },
        onPaste(event) {
          event.preventDefault();
          const value = event.clipboardData.getData("Text").trim();
          send({ type: "PASTE", value, index });
        },
      };
    },
  };
}
