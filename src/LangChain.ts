import config from "config"
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

// https://js.langchain.com/docs/getting-started/guide-llm

// LLMs: Get Predictions from a Language Model
// npm install -S langchain
export async function promptingLLM() {
  const model = new OpenAI({ openAIApiKey: config.get<string>("OPENAI_API_KEY"), temperature: 0.9 });
  const res = await model.call(
    "What would be a good company name a company that makes colorful socks?"
  );
  console.log(res);
  //出力: Cheery Toes Socks.
}


// Prompt Templates: Manage Prompts for LLMs
export async function createPromptTemplate() {
  const template = "What is a good name for a company that makes {product}?";
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["product"],
  });
  const res = await prompt.format({ product: "colorful socks" })
  console.log(res);
  //出力: What is a good name for a company that makes colorful socks?
}


// Chains: Combine LLMs and Prompts in Multi-Step Workflows
export async function promptingByLangChain() {
  const model = new OpenAI({ openAIApiKey: config.get<string>("OPENAI_API_KEY"), temperature: 0.9 });
  const template = "What is a good name for a company that makes {product}?";
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["product"],
  });
  const chain = new LLMChain({ llm: model, prompt: prompt });
  const res = await chain.call({ product: "colorful socks" });
  console.log(res);
  //出力: { text: '\n\nRainbow Toes Socks.' }
}


// Agents: Dynamically Run Chains Based on User Input
// npm install -S serpapi
// https://serpapi.com/ でAPIKeyを取得
export async function promptingByAgent() {
  const model = new OpenAI({ openAIApiKey: config.get<string>("OPENAI_API_KEY"), temperature: 0.9 });
  const tools = [
    new SerpAPI(config.get<string>("SERPAPI_API_KEY"), {
      location: "Austin,Texas,United States",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];
  // 入力したtoolsをAgentがいい感じに使ってくれるっぽい。入出力は文字列が必須。

  const execitor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description"
    // Q.agentTypeによって何が違うのか？
  })

  console.log("Loaded agent.");
  const input = "Who is Olivia Wilde's boyfriend?" + " What is his current age raised to the 0.23 power?";
  console.log(`Executing with input "${input}"...`);
  const result = await execitor.call({ input });
  console.log(`Got output ${result.output}`);
  //出力: Got output Jason Sudeikis is Olivia Wilde's boyfriend, and his current age raised to the 0.23 power is 2.3493097822685836.
} 


// Memory: Add State to Chains and Agents
export async function promptingSaving() { 
  const model = new OpenAI({ openAIApiKey: config.get<string>("OPENAI_API_KEY"), temperature: 0.9 });
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory: memory });
  const res1 = await chain.call({ input: "Hi! I'm Jim." });
  console.log(res1);
  
  const res2 = await chain.call({ input: "What's my name?" });
  console.log(res2);
}


// Streaming
export async function stremingPrompting() {
  const chat = new OpenAI({
    openAIApiKey: config.get<string>("OPENAI_API_KEY"), 
    temperature: 0.9,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token: string) {
          process.stdout.write(token);
        },
      },
    ],
  });
  const res = await chat.call("Write me a song about sparkling water.");
  console.log(res)
  
}
