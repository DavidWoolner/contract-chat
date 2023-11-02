import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { getPineconeIndex } from '@/app/utils/pinecone';

export async function POST(req: NextRequest) {
  const query =
    (await req.json()) || 'Ask me what I would like to know about the contract';

  const pineconeIndex = await getPineconeIndex();

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const template =
    'You are being asked questions by laymen regarding labor contracts for the Interntaionl Alliance of Theatrical Stage Engineers or IATSE, specifically Local 52. You job is to provide friendly, clear response. It should be succinct, but also give enough detail to help inspire further questioning. Here is your question: ';

  try {
    const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' });
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);
    const response = await chain.call({
      query: template + query,
    });

    return NextResponse.json(response);
  } catch (e) {
    console.log('Error:', e);
  }
}
