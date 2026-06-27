import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET: Retrieve all knowledge base documents
export async function GET() {
  try {
    const { data: docs, error } = await supabase
      .from('knowledge_docs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      docs: docs || []
    });
  } catch (err: any) {
    console.error('List Route Error:', err);
    return NextResponse.json({
      error: err?.message || 'Failed to fetch knowledge documents'
    }, { status: 500 });
  }
}

// DELETE: Remove a knowledge base document (and cascade delete its chunks)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('knowledge_docs')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Document and its chunks deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete Route Error:', err);
    return NextResponse.json({
      error: err?.message || 'Failed to delete document'
    }, { status: 500 });
  }
}
