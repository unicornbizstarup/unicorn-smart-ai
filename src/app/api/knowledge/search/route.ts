import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embedText } from '../../../../lib/embedding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const category = searchParams.get('category'); // optional filter

    if (!query) {
      return NextResponse.json({ error: 'Search query "q" is required' }, { status: 400 });
    }

    // 1. Generate text embedding
    const embedding = await embedText(query);

    // 2. Query Supabase vector similarity function
    // If a category filter is active, fetch a larger batch of candidates to filter down.
    const candidateLimit = category && category !== 'all' ? limit * 3 : limit;
    
    const { data: results, error } = await supabase.rpc('search_knowledge', {
      query_embedding: embedding,
      match_count: candidateLimit,
      min_score: 0.60 // Use a slightly lower threshold to find more candidates
    });

    if (error) {
      throw error;
    }

    // 3. Post-process and filter by category if specified
    let filteredResults = results || [];
    if (category && category !== 'all') {
      filteredResults = filteredResults.filter((r: any) => {
        const docCategory = r.metadata?.category || 'general';
        return docCategory === category;
      });
    }

    // Slice to the requested limit
    const finalResults = filteredResults.slice(0, limit);

    return NextResponse.json({
      success: true,
      results: finalResults
    });
  } catch (err: any) {
    console.error('Search Route Error:', err);
    return NextResponse.json({
      error: err?.message || 'Failed to search knowledge base'
    }, { status: 500 });
  }
}
