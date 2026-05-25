import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Profile, UserMission } from "@/types";

export const runtime = "edge";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: missions } = await supabase
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<UserMission[]>();

  const levelLabels = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = (profile?.ubc_level ?? 1) as 1 | 2 | 3 | 4;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <div className="glass p-6 mb-6">
        <h1 className="font-display text-2xl text-brand-gold mb-1">
          สวัสดี, {profile?.full_name ?? "Unicorn"}! 🦄
        </h1>
        <p className="text-white/60 text-sm">
          ระดับ {level} · {levelLabels[level]} · {profile?.points ?? 0} คะแนน
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "คะแนนสะสม", value: profile?.points ?? 0, icon: "⭐" },
          { label: "ระดับ UBC", value: `Level ${level}`, icon: "🏆" },
          { label: "Wealth DNA", value: profile?.wealth_element ?? "ยังไม่ได้วิเคราะห์", icon: "🧬" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-semibold text-brand-gold">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass p-6">
        <h2 className="font-display text-lg text-brand-gold mb-4">ภารกิจล่าสุด</h2>
        {missions && missions.length > 0 ? (
          <ul className="space-y-3">
            {missions.map((um) => (
              <li key={um.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm">{um.mission?.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  um.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                  um.status === "VERIFIED"  ? "bg-brand-gold/20 text-brand-gold" :
                  "bg-white/10 text-white/50"
                }`}>{um.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/40 text-sm">ยังไม่มีภารกิจ — ไปเริ่มภารกิจแรกได้เลย!</p>
        )}
      </div>
    </main>
  );
}
