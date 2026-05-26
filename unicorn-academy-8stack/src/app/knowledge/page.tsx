import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";
import KnowledgeClient from "./KnowledgeClient";

export const runtime = "edge";

export default async function MemberKnowledgePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch logged in profile for MemberLayout
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <MemberLayout
      profile={profile}
      title="Knowledge Library"
      subtitle="คลังสื่อการสอนและเครื่องมือทางการตลาดเพื่อยกระดับนักธุรกิจมืออาชีพ"
    >
      <KnowledgeClient />
    </MemberLayout>
  );
}
