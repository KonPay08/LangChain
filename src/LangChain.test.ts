import { promptingLLM, createPromptTemplate, promptingByLangChain, promptingByAgent, promptingSaving, stremingPrompting } from "src/LangChain";

test("LangChain test", async () => {
  // await promptingLLM();
  // await createPromptTemplate();
  // await promptingByLangChain();
  // await promptingByAgent();
  // await promptingSaving();
  await stremingPrompting();
  expect(1 + 1).toBe(2);
}, 10000 * 10);
