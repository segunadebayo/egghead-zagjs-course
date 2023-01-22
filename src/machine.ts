import { createMachine } from "@zag-js/core";

// state
type MachineState = {
  value: "idle" | "focused";
};

// context
type MachineContext = {
  value: string[];
  focusedIndex: number;
  readonly isCompleted: boolean;
  onComplete?: (value: string[]) => void;
};

export const machine = createMachine<MachineContext, MachineState>(
  {
    id: "pin-input",
    context: {
      value: Array.from<string>({ length: 4 }).fill(""),
      focusedIndex: -1,
      onComplete(value) {
        console.log({ value });
      },
    },
    computed: {
      isCompleted(ctx) {
        return ctx.value.every((value) => value !== "");
      },
    },
    watch: {
      focusedIndex: ["executeFocus"],
      isCompleted: ["invokeOnComplete"],
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          FOCUS: {
            target: "focused",
            actions: ["setFocusedIndex"],
          },
          LABEL_CLICK: {
            actions: ["focusFirstInput"],
          },
        },
      },
      focused: {
        on: {
          BLUR: {
            target: "idle",
            actions: ["clearFocusedIndex"],
          },
          INPUT: {
            actions: ["setFocusedValue", "focusNextInput"],
          },
          BACKSPACE: {
            actions: ["clearFocusedValue", "focusPreviousInput"],
          },
          PASTE: {
            actions: ["setPastedValue", "focusLastEmptyInput"],
          },
        },
      },
    },
  },
  {
    actions: {
      setFocusedIndex(context, event) {
        context.focusedIndex = event.index;
      },
      clearFocusedIndex(context) {
        context.focusedIndex = -1;
      },
      setFocusedValue(context, event) {
        const eventValue: string = event.value;
        const focusedValue = context.value[context.focusedIndex];
        const nextValue = getNextValue(focusedValue, eventValue);
        context.value[context.focusedIndex] = nextValue;
      },
      clearFocusedValue(context) {
        context.value[context.focusedIndex] = "";
      },
      focusFirstInput(context) {
        context.focusedIndex = 0;
      },
      focusPreviousInput(context) {
        const previousIndex = Math.max(0, context.focusedIndex - 1);
        context.focusedIndex = previousIndex;
      },
      focusNextInput(context) {
        const nextIndex = Math.min(
          context.focusedIndex + 1,
          context.value.length - 1
        );
        context.focusedIndex = nextIndex;
      },
      executeFocus(context) {
        const inputGroup = document.querySelector("[data-part=input-group]");
        if (!inputGroup || context.focusedIndex === -1) return;
        const inputElements = Array.from(
          inputGroup.querySelectorAll<HTMLInputElement>("[data-part=input]")
        );
        const input = inputElements[context.focusedIndex];
        requestAnimationFrame(() => {
          input?.focus();
        });
      },
      setPastedValue(context, event) {
        const pastedValue: string[] = event.value
          .split("")
          .slice(0, context.value.length);

        pastedValue.forEach((value, index) => {
          context.value[index] = value;
        });
      },
      focusLastEmptyInput(context) {
        const index = context.value.findIndex((value) => value === "");
        const lastIndex = context.value.length - 1;
        context.focusedIndex = index === -1 ? lastIndex : index;
      },
      invokeOnComplete(context) {
        if (!context.isCompleted) return;
        context.onComplete?.(Array.from(context.value));
      },
    },
  }
);

function getNextValue(focusedValue: string, eventValue: string) {
  let nextValue = eventValue;
  // "2", "29" => "9"
  if (focusedValue[0] === eventValue[0]) {
    nextValue = eventValue[1];
    // "2", "92" => "9"
  } else if (focusedValue[0] === eventValue[1]) {
    nextValue = eventValue[0];
  }
  return nextValue;
}
