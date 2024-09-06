"use client";

import { useState } from "react";
import { generate } from "../lib/chat/actions";
import { readStreamableValue } from "ai/rsc";

// https://sdk.vercel.ai/examples/next-app/basics/streaming-text-generation

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [generation, setGeneration] = useState<string>("");

  return (
    <div>
      <button
        onClick={async () => {
          const { output } = await generate("Why is the sky blue?");

          for await (const delta of readStreamableValue(output)) {
            setGeneration(
              (currentGeneration) => `${currentGeneration}${delta}`
            );
          }
        }}
      >
        Ask
      </button>

      <div>{generation}</div>
    </div>
  );
}
