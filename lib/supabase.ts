// Supabase is temporarily disabled. Membership system will be integrated in the next phase.
// lib/supabase.ts - Stub placeholder

export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Auth not available' } }),
        signOut: async () => ({ error: null }),
    },
    from: (_table: string) => ({
        select: (_cols?: string) => ({
            eq: (_col: string, _val: unknown) => ({
                single: async () => ({ data: null, error: null }),
            }),
        }),
        upsert: async (_data: unknown) => ({ error: null }),
    }),
};
