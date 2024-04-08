import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

try {
  const result = await fetch(
    "https://raw.githubusercontent.com/BisratGirma/chat-mind/main/data.txt"
  );
  const text = await result.text();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });

  const output = await splitter.createDocuments([text]);

  const sbApiKey = process.env.DB_KEY;
  const sbUrl = process.env.DB_URL;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: "documents",
    }
  );

  // splitted text
  console.log(output);
} catch (err) {
  console.log(err);
}
