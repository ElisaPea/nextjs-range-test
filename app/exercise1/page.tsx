import type { Metadata } from "next";
import { Exercise1Range } from "./Exercise1Range";

export const metadata: Metadata = {
  title: "Exercise 1 · Normal Range",
};

export default function Exercise1Page() {
  return (
    <main>
      <h1>Exercise 1: Normal Range</h1>
      <Exercise1Range />
    </main>
  );
}
