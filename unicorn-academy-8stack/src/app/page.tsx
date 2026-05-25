import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="font-display text-5xl md:text-6xl text-brand-gold">
          Unicorn Academy
        </h1>
        <p className="text-white/70 text-lg">
          Smart Business Platform for Unicorn Biz Coach
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/dashboard" className="btn-gold">
            เข้าสู่ระบบ
          </Link>
          <Link href="/dna" className="btn-outline">
            ค้นหา Wealth DNA
          </Link>
        </div>
      </div>
    </main>
  );
}
