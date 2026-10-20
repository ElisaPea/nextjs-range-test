import { useRef, useState } from "react";
import styles from "./Range.module.css";

interface EditableLabelProps {
  value: number;
  ariaLabel: string;
  onCommit: (value: number) => void;
}

/** Muestra un valor que al hacer clic se convierte en un input editable */
export function EditableLabel({
  value,
  ariaLabel,
  onCommit,
}: EditableLabelProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const startEditing = () => setDraft(String(value));

  const commit = () => {
    const parsed = Number(draft);
    const isValid =
      draft !== null && draft.trim() !== "" && Number.isFinite(parsed);

    if (isValid && !cancelledRef.current) onCommit(parsed);

    cancelledRef.current = false;
    setDraft(null);
  };

  if (draft === null) {
    return (
      <button
        type="button"
        className={styles.labelButton}
        aria-label={`${ariaLabel}: ${value}. Pulsa para editar`}
        onClick={startEditing}
      >
        {value}
      </button>
    );
  }

  return (
    <input
      type="number"
      className={styles.labelInput}
      aria-label={ariaLabel}
      value={draft}
      autoFocus
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          cancelledRef.current = true;
          event.currentTarget.blur();
        }
      }}
    />
  );
}
