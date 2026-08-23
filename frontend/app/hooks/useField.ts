import { useState } from 'react'

export interface Field {
  type: string
  value: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  reset: () => void
}

// FSO Part 7's useField pattern: `reset` isn't a valid DOM input prop, so
// callers must destructure it out before spreading the rest onto <input>/<select>.
export function useField(type: string): Field {
  const [value, setValue] = useState('')

  function onChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setValue(event.target.value)
  }

  function reset() {
    setValue('')
  }

  return { type, value, onChange, reset }
}
