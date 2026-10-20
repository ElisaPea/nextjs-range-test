import { NextResponse } from "next/server";

const RANGE_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

export function GET() {
  return NextResponse.json({ rangeValues: RANGE_VALUES });
}
