import { NextResponse } from "next/server";

const MIN_VALUE = 1;
const MAX_VALUE = 100;

export function GET() {
  return NextResponse.json({ min: MIN_VALUE, max: MAX_VALUE });
}
