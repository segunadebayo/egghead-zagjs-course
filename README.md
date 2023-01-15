## PinInput Logic

- The pin-input component has two states: `IDLE` and `FOCUSED`

- In the `IDLE` state:

  - When an input is focused:
    - Transition to the `FOCUSED` state
    - Save the index of the focused input

- In the `FOCUSED` state:

  - When an input is blurred:

    - Transition to the `IDLE` state
    - Reset the focused index

  - When a character is pressed:

    - Save the value
    - Focus the next input

  - When the backspace key is pressed:

    - Clear the value of the focused input
    - Focus the previous input

  - When text is pasted from clipboard:

    - Distribute the pasted value
    - Focus the last empty input
