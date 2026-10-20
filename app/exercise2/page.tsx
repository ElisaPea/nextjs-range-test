import { Range } from "@/components/range";

export default function Exercise2Page() {
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
        mode="fixed"
        values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
        label="Precio 2"
      />
    </main>
  );
}
