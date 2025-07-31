// Test untuk AskGemini helper secara langsung
const { askGemini } = require("../helpers/AskGemini");

// Mock Google Generative AI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest
            .fn()
            .mockReturnValue("Mocked Gemini response for unit test"),
        },
      }),
    }),
  })),
}));

describe("AskGemini Helper Unit Test", () => {
  it("should call askGemini function and return response", async () => {
    const result = await askGemini("Test prompt for recommendation");
    expect(result).toBe("Mocked Gemini response for unit test");
  });

  it("should handle different prompts", async () => {
    const result = await askGemini("Another test prompt");
    expect(result).toBe("Mocked Gemini response for unit test");
  });
});
