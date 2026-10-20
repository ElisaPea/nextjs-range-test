import { getFixedRangeValues, getRangeLimits } from "./rangeService";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

function mockResponse(body: unknown, { ok = true, status = 200 } = {}) {
  mockFetch.mockResolvedValue({ ok, status, json: async () => body });
}

describe("getRangeLimits", () => {
  it("pide /api/range y devuelve los límites", async () => {
    mockResponse({ min: 1, max: 100 });

    await expect(getRangeLimits()).resolves.toEqual({ min: 1, max: 100 });
    expect(mockFetch).toHaveBeenCalledWith("/api/range");
  });

  it("lanza un error si la respuesta no es ok", async () => {
    mockResponse(null, { ok: false, status: 500 });

    await expect(getRangeLimits()).rejects.toThrow("500");
  });

  it("propaga los errores de red", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(getRangeLimits()).rejects.toThrow("Network error");
  });
});

describe("getFixedRangeValues", () => {
  it("pide /api/fixed-range y devuelve los valores", async () => {
    const rangeValues = [1.99, 5.99, 10.99];
    mockResponse({ rangeValues });

    await expect(getFixedRangeValues()).resolves.toEqual({ rangeValues });
    expect(mockFetch).toHaveBeenCalledWith("/api/fixed-range");
  });

  it("lanza un error si la respuesta no es ok", async () => {
    mockResponse(null, { ok: false, status: 404 });

    await expect(getFixedRangeValues()).rejects.toThrow("404");
  });
});
