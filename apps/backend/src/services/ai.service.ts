import { env } from "../config/env.js";
import { gemini } from "../config/gemini.js";

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
  if (!gemini) {
    return null;
  }

  const interaction = await gemini.interactions.create({
    model: env.GEMINI_MODEL,
    system_instruction: SUMMARY_INSTRUCTIONS,
    input: `Title: ${title}

Content:
${content}`,
  });

  const summary =
    interaction.output_text?.trim() ?? "";

  if (!summary) {
    return null;
  }

  return summary;
}