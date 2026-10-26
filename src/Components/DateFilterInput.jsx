import { useRef } from "react";

export default function DateFilterInput({ name, value, onChange }) {
  const inputRef = useRef(null);
  const bloquearEscritura = event => {
    if (["Tab", "Shift", "ArrowLeft", "ArrowRight", "Escape"].includes(event.key)) return;
    event.preventDefault();
  };

  return <input
    ref={inputRef}
    type="date"
    name={name}
    value={value}
    onChange={onChange}
    onKeyDown={bloquearEscritura}
    onPaste={event => event.preventDefault()}
    inputMode="none"
  />;
}