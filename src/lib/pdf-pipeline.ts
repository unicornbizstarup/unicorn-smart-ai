import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { embedText } from './embedding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase admin client to bypass RLS for administrative operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Split text into chunks with sliding overlap
function splitIntoChunks(text: string, size = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    let boundary = end;
    if (end < clean.length) {
      const lastSpace = clean.lastIndexOf(' ', end);
      if (lastSpace > start) boundary = lastSpace;
    }
    const chunk = clean.slice(start, boundary).trim();
    if (chunk.length > 20) chunks.push(chunk);
    start = boundary - overlap;
    if (start <= 0 || boundary >= clean.length) break;
  }
  return chunks;
}

// Extract raw text from PDF using Gemini OCR capabilities
async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GERMINI_API_KEY is not defined in environment variables');
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      },
      'Extract all text from this PDF document verbatim. Do not summarize, format, or add commentary. Return only the extracted text contents.',
    ],
  });

  return response.text || '';
}

export async function processPdfPipeline(
  pdfBuffer: Buffer,
  fileName: string,
  fileSize: number,
  category: string
): Promise<string> {
  // 1. Create document record in database
  const { data: doc, error: docError } = await supabaseAdmin
    .from('knowledge_docs')
    .insert({
      title: fileName,
      category: category || 'general',
      source_type: 'pdf',
      file_size: fileSize,
      status: 'pending',
    })
    .select()
    .single();

  if (docError || !doc) {
    throw new Error(`Failed to create document record: ${docError?.message || 'Unknown error'}`);
  }

  const docId = doc.id;

  try {
    // 2. Mark status as processing
    await supabaseAdmin
      .from('knowledge_docs')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', docId);

    // 3. Extract text from PDF using Gemini
    const text = await extractTextFromPdf(pdfBuffer);
    if (!text || text.trim().length === 0) {
      throw new Error('No text content could be extracted from the PDF');
    }

    // 4. Split into chunks
    const chunks = splitIntoChunks(text, 500, 50);
    if (chunks.length === 0) {
      throw new Error('Text extraction succeeded but resulted in 0 valid chunks');
    }

    // 5. Generate embeddings and save in batches
    const chunkRows = [];
    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const embedding = await embedText(content);
      
      chunkRows.push({
        doc_id: docId,
        content,
        embedding,
        chunk_index: i,
        metadata: {
          title: fileName,
          category,
          chunk_index: i,
        },
      });
    }

    // Batch insert (10 at a time to prevent large payload limits)
    const BATCH_SIZE = 10;
    for (let i = 0; i < chunkRows.length; i += BATCH_SIZE) {
      const batch = chunkRows.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabaseAdmin
        .from('knowledge_chunks')
        .insert(batch);
        
      if (insertError) {
        throw new Error(`Failed to insert chunks batch: ${insertError.message}`);
      }
    }

    // 6. Update document as indexed
    await supabaseAdmin
      .from('knowledge_docs')
      .update({
        status: 'indexed',
        chunk_count: chunks.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', docId);

    return docId;
  } catch (err: any) {
    console.error('PDF Pipeline Error:', err);
    
    // Mark document as error
    await supabaseAdmin
      .from('knowledge_docs')
      .update({
        status: 'error',
        error_msg: err?.message || String(err),
        updated_at: new Date().toISOString(),
      })
      .eq('id', docId);

    throw err;
  }
}
