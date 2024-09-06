import { createAzure } from "@ai-sdk/azure";

export const MODEL_NAME = "GPT-4";

export const openai = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME, // Azure resource name
  apiKey: process.env.AZURE_OPENAI_API_KEY, // Azure API key
  fetch: async (url, options) => {
    // const query = JSON.parse(options!.body! as string).messages[0].content

    const originalResponse = await fetch(url, options);

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = originalResponse.body!.getReader();

        // console.log("Steam Started \n");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          try {
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            const text = decoder.decode(value);

            // console.log("Text\n", text);

            controller.enqueue(encoder.encode(text));
          } catch (error) {
            console.error("Error", error);
            controller.error(error);
            break;
          }
        }

        controller.close();
      },
    });

    // console.log("Response", response.status, response.body);

    return new Response(transformedStream, {
      headers: originalResponse.headers,
      status: originalResponse.status,
      statusText: originalResponse.statusText,
    });
  },
});
