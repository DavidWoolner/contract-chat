import { getPineconeIndex } from '@/app/utils/pinecone';
// import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import * as dotenv from 'dotenv';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// dotenv.config();

// const client = new PineconeClient();

// const setupPinecone = async () => {
//   await client.init({
//     apiKey: process.env.PINECONE_API_KEY as string,
//     environment: process.env.PINECONE_ENVIRONMENT as string,
//   });
//   const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);
//   return pineconeIndex;
// };

// const pineconeIndex = await setupPinecone();

const loader = new PDFLoader(
  'src/app/docs/Local 52 Majors 2018 Searchable.pdf',
  { splitPages: false }
);

// const getDocs = async (pineconeIndex) => {
//   const docs = await loader.load();
//   // await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//   //   pineconeIndex,
//   // });
// }

export async function GET() {
  try {
    // await client.init({
    //   apiKey: process.env.PINECONE_API_KEY as string,
    //   environment: process.env.PINECONE_ENVIRONMENT as string,
    // });
    // const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);
    const pineconeIndex = await getPineconeIndex();

    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docOutput = await splitter.createDocuments([docs[0].pageContent]);

    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await PineconeStore.fromDocuments(
      docOutput,
      embeddings,
      {
        pineconeIndex,
      }
    );

    return NextResponse.json(
      { result: 'done', store: vectorStore },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
