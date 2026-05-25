import { createServiceSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Profile } from "@/types";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("referral_slug", slug)
    .single<Pick<Profile, "full_name" | "bio">>();

  return {
    title: data ? `ทีมของ ${data.full_name} | Unicorn Academy` : "Unicorn Academy",
    description: data?.bio ?? "Join the Unicorn Team",
  };
}

export default async function ReferralPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServiceSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("referral_slug", slug)
    .single<Profile>();

  if (!profile) notFound();

  const levelLabels = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = profile.ubc_level as 1 | 2 | 3 | 4;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 text-center space-y-4">
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={96} height={96}
            className="rounded-full mx-auto border-2 border-brand-gold/40"
          />
        )}
        <h1 className="font-display text-2xl text-brand-gold">{profile.full_name}</h1>
        <p className="text-white/60 text-sm">
          UBC Level {level} · {levelLabels[level]}
        </p>
        {profile.bio && <p className="text-white/70 text-sm">{profile.bio}</p>}
        {profile.specialization && (
          <p className="text-brand-gold/80 text-xs">✨ {profile.specialization}</p>
        )}
        <div className="flex gap-3 justify-center flex-wrap pt-2">
          {profile.line_id && (
            <a href={`https://line.me/ti/p/~${profile.line_id}`} target="_blank" rel="noopener noreferrer"
               className="btn-outline text-sm">LINE</a>
          )}
          {profile.youtube_url && (
            <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer"
               className="btn-outline text-sm">YouTube</a>
          )}
        </div>
        <a href={`/auth/register?ref=${slug}`} className="btn-gold w-full block mt-4">
          เข้าร่วมทีม 🦄
        </a>
      </div>
    </main>
  );
}
