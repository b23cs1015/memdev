import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

const mockInteractionsCreate =
  vi.hoisted(() => vi.fn());

vi.mock("../src/config/gemini.js", () => ({
  gemini: {
    interactions: {
      create: mockInteractionsCreate,
    },
  },
}));

import { generateNoteSummary } from "../src/services/ai.service.js";

describe("AI summarization service", () => {
  it("returns the generated summary", async () => {
    mockInteractionsCreate.mockResolvedValue({
      output_text:
        "Rate limiting controls request frequency to protect services from excessive traffic.",
    });

    const summary =
      await generateNoteSummary(
        "Rate Limiting",
        "Rate limiting controls request frequency.",
      );

    expect(summary).toBe(
      "Rate limiting controls request frequency to protect services from excessive traffic.",
    );

    expect(
      mockInteractionsCreate,
    ).toHaveBeenCalledWith({
      model: expect.any(String),
      system_instruction:
        expect.stringContaining(
          "You summarize notes",
        ),
      input:
        "Title: Rate Limiting\n\nContent:\nRate limiting controls request frequency.",
    });
  });

  it("trims the generated summary", async () => {
    mockInteractionsCreate.mockResolvedValue({
      output_text:
        "  A concise summary.  ",
    });

    const summary =
      await generateNoteSummary(
        "Test",
        "Test content",
      );

    expect(summary).toBe(
      "A concise summary.",
    );
  });

  it("returns null when Gemini returns empty output", async () => {
    mockInteractionsCreate.mockResolvedValue({
      output_text: "   ",
    });

    const summary =
      await generateNoteSummary(
        "Test",
        "Test content",
      );

    expect(summary).toBeNull();
  });

  it("propagates provider errors", async () => {
    mockInteractionsCreate.mockRejectedValue(
      new Error(
        "Gemini API unavailable",
      ),
    );

    await expect(
      generateNoteSummary(
        "Test",
        "Test content",
      ),
    ).rejects.toThrow(
      "Gemini API unavailable",
    );
  });
});