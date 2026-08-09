import { env } from "../config/env.js";
import { openai } from "../config/openai.js";

const SUMMARY_INSTRUCTIONS = `
You summarize notes for a personal knowledge management application.

Rules:
- Produce a concise summary.
- Preserve the important facts and technical details.
- Do not invent information.
- Do not mention that you are an AI.
- Do not use markdown headings.
- Prefer 2-4 clear sentences.
- Return only the summary text.
`;

export async function generateNoteSummary(
  title: string,
  content: string,
): Promise<string | null> {
  if (!openai) {
    return null;
  }

  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    instructions: SUMMARY_INSTRUCTIONS,
    input: `Title: ${title}\n\nContent:\n${content}`,
  });

  const summary = response.output_text.trim();

  if (!summary) {
    return null;
  }

  return summary;
}