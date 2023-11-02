import { getPineconeIndex } from '@/app/utils/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const loader = new PDFLoader(
  // 'src/app/docs/Local 52 Majors 2018 Searchable.pdf',
  'src/app/docs/Deal Memorandum Individual -- David Woolner.pdf',

  { splitPages: false }
);

export async function GET() {
  try {
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
