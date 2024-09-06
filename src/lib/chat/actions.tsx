"use server";

import { streamText } from "ai";
import { openai, MODEL_NAME } from "../provider/azure-openai";
import { createStreamableValue } from "ai/rsc";

export async function generate(input: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai(MODEL_NAME),
      prompt: input,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
