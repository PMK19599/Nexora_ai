import { getEmbedding } from './ai';

export interface ISyllabusChunk {
  text: string;
  embedding: number[];
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function sliceTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const cleanedText = cleanText(text);
  const chunks: string[] = [];
  let i = 0;

  if (cleanedText.length === 0) return [];

  while (i < cleanedText.length) {
    const chunk = cleanedText.substring(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - overlap;
    
    // Terminate if the remaining text to chunk is entirely within the overlap threshold
    if (i >= cleanedText.length - overlap && cleanedText.length > chunkSize) {
      break;
    }
  }
  return chunks;
}

export async function chunkAndEmbed(text: string): Promise<ISyllabusChunk[]> {
  const chunks = sliceTextIntoChunks(text);
  const chunkedWithEmbeddings: ISyllabusChunk[] = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    chunkedWithEmbeddings.push({ text: chunk, embedding });
  }

  return chunkedWithEmbeddings;
}

// Perform mathematical cosine similarity search on normalized vectors (simple dot product)
export function similaritySearch(queryEmbedding: number[], chunks: ISyllabusChunk[], topK: number = 3): ISyllabusChunk[] {
  const scored = chunks.map(chunk => {
    let dotProduct = 0;
    const len = Math.min(queryEmbedding.length, chunk.embedding.length);
    for (let i = 0; i < len; i++) {
      dotProduct += queryEmbedding[i] * chunk.embedding[i];
    }
    return { chunk, score: dotProduct };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.chunk);
}

// Sample representative chunks evenly distributed throughout the document to avoid context windows limits
export function getRepresentativeChunks<T>(chunks: T[], maxCount: number = 8): T[] {
  if (chunks.length <= maxCount) return chunks;
  const step = chunks.length / maxCount;
  const selected: T[] = [];
  for (let i = 0; i < maxCount; i++) {
    const idx = Math.floor(i * step);
    selected.push(chunks[idx]);
  }
  return selected;
}
