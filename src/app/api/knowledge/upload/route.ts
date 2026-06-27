import { NextRequest, NextResponse } from 'next/server';
import { processPdfPipeline } from '../../../../lib/pdf-pipeline';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if the uploaded file is indeed a PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process PDF and ingest chunks to Supabase vector database
    const docId = await processPdfPipeline(buffer, file.name, file.size, category);

    return NextResponse.json({
      success: true,
      message: 'PDF processed and indexed successfully',
      docId
    });
  } catch (err: any) {
    console.error('Upload Route Error:', err);
    return NextResponse.json({
      error: err?.message || 'Failed to process and index PDF'
    }, { status: 500 });
  }
}
