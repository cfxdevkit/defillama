import { DefiLlamaAPI } from "../../core/api";

// Mock the logger to avoid console output during tests
jest.mock("../../utils/logger", () => ({
  createLogger: () => ({
    debug: jest.fn(),
    error: jest.fn(),
  }),
}));

// Mock fetch globally since it's used directly without import
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("DefiLlamaAPI", () => {
  let api: DefiLlamaAPI;

  beforeEach(() => {
    api = new DefiLlamaAPI();
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("fetchApi", () => {
    it("should fetch data successfully", async () => {
      const mockData = { test: "data" };
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.resolve(mockData),
        })
      );

      const result = await api["fetchApi"]("/test");
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("https://api.llama.fi/test");
    });

    it("should handle non-ok response", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.resolve({}),
        })
      );

      await expect(api["fetchApi"]("/test")).rejects.toThrow("HTTP error! status: 404");
    });

    it("should handle network errors", async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error("Network error")));

      await expect(api["fetchApi"]("/test")).rejects.toThrow("Network error");
    });

    it("should handle JSON parsing errors", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.reject(new Error("Invalid JSON")),
        })
      );

      await expect(api["fetchApi"]("/test")).rejects.toThrow("Invalid JSON");
    });

    it("should use custom base URL when provided", async () => {
      const customApi = new DefiLlamaAPI("https://custom.api.com");
      const mockData = { test: "data" };
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.resolve(mockData),
        })
      );

      await customApi["fetchApi"]("/test");
      expect(mockFetch).toHaveBeenCalledWith("https://custom.api.com/test");
    });

    it("should handle query parameters", async () => {
      const mockData = { test: "data" };
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.resolve(mockData),
        })
      );

      await api["fetchApi"]("/test", undefined, { param1: "value1", param2: 123 });
      expect(mockFetch).toHaveBeenCalledWith("https://api.llama.fi/test?param1=value1&param2=123");
    });
  });
});
