import { FixedRangeResponse, RangeLimits } from "@/types/range";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${res.status}`);
  }

  return res.json();
}

export async function getRangeLimits(): Promise<RangeLimits> {
  return fetchJson<RangeLimits>("/api/range");
}

export async function getFixedRangeValues(): Promise<FixedRangeResponse> {
  return fetchJson<FixedRangeResponse>("/api/fixed-range");
}
