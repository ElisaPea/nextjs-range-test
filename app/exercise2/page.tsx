import type { Metadata } from "next";
import { Exercise2Range } from "./Exercise2Range";

export const metadata: Metadata = {
  title: "Exercise 2 · Fixed Values Range",
};

export default function Exercise2Page() {
  return (
    <main>
      <h1>Exercise 2: Fixed Values Range</h1>
      <Exercise2Range />
    </main>
  );
}
