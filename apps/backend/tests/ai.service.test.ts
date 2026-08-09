import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

const mockResponsesCreate = vi.hoisted(
  () => vi.fn(),
);

vi.mock("../src/config/openai.js", () => ({
  openai: {
    responses: {
      create: mockResponsesCreate,
    },
  },
}));

import { generateNoteSummary } from "../src/services/ai.service.js";

describe("AI summarization service", () => {
  it("returns the generated summary", async () => {
    mockResponsesCreate.mockResolvedValue({
      output_text:
        "Rate limiting controls request frequency to protect services from excessive traffic.",
    });

    const summary = await generateNoteSummary(
      "Rate Limiting",
      "Rate limiting controls request frequency.",
    );

    expect(summary).toBe(
      "Rate limiting controls request frequency to protect services from excessive traffic.",
    );

    expect(mockResponsesCreate).toHaveBeenCalledWith({
      model: expect.any(String),
      instructions: expect.stringContaining(
        "You summarize notes",
      ),
      input:
        "Title: Rate Limiting\n\nContent:\nRate limiting controls request frequency.",
    });
  });

  it("trims the generated summary", async () => {
    mockResponsesCreate.mockResolvedValue({
      output_text: "  A concise summary.  ",
    });

    const summary = await generateNoteSummary(
      "Test",
      "Test content",
    );

    expect(summary).toBe("A concise summary.");
  });

  it("returns null when OpenAI returns empty output", async () => {
    mockResponsesCreate.mockResolvedValue({
      output_text: "   ",
    });

    const summary = await generateNoteSummary(
      "Test",
      "Test content",
    );

    expect(summary).toBeNull();
  });

  it("propagates provider errors", async () => {
    mockResponsesCreate.mockRejectedValue(
      new Error("OpenAI API unavailable"),
    );

    await expect(
      generateNoteSummary(
        "Test",
        "Test content",
      ),
    ).rejects.toThrow(
      "OpenAI API unavailable",
    );
  });
});