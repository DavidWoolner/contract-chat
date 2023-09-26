import { NextResponse } from 'next/server';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getPineconeIndex } from '@/app/utils/pinecone';

export async function GET() {
  const pineconeIndex = await getPineconeIndex();

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  try {
    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);
    const response = await chain.call({
      query: "What is the 30 mile zone?"
    })

    return NextResponse.json(response)
  } catch (e) {
    console.log('Error:', e);

  }
}
