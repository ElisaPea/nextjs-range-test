import { Range } from "@/components/range";

export default function Exercise1Page() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <Range
        mode="continuous"
        min={1}
        max={100}
        label="Precio 1"
        defaultValue={{ min: 20, max: 80 }}
      />
    </main>
  );
}
