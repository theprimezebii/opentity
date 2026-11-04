import Link from "next/link";
import { ArrowRight, Globe, Trophy, Users, ShieldCheck, Zap, Target, Award } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/public/PageHero";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export const instant = false;

export const metadata = {
  title: "About | Opentity",
  description: "Learn about Opentity, the global hub for hackathons, tech competitions, and AI events.",
};

export default async function AboutPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* HERO (Matches Homepage Video Style) */}
      <PageHero
        badge="Our Story"
        title={<>We connect students with <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">opportunity.</span></>}
        subtitle="Opentity was built with a single mission: to make discovering hackathons, competitions, and tech events effortless for students everywhere."
      />

      {/* MISSION & STATS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal type="right">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Why we built Opentity
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-6">
                Finding opportunities used to mean scrolling through endless social media posts, WhatsApp groups, and university notice boards. We missed deadlines because the information was scattered.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                Opentity centralizes everything. We aggregate events globally, so you can focus on building, competing, and winning.
              </p>
            </div>
          </Reveal>

          <Reveal type="left" delay={200}>
            {/* Perfect 2x2 Grid for Stats */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <StatCard 
                icon={<Globe className="w-6 h-6" />} 
                value="Global" 
                label="Events worldwide" 
              />
              <StatCard 
                icon={<Trophy className="w-6 h-6" />} 
                value="$500k+" 
                label="Prizes tracked" 
              />
              <StatCard 
                icon={<Users className="w-6 h-6" />} 
                value="10K+" 
                label="Students" 
              />
              <StatCard 
                icon={<ShieldCheck className="w-6 h-6" />} 
                value="100%" 
                label="Free forever" 
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                What you can do here
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
                Everything you need to accelerate your tech journey, in one platform.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Zap className="w-7 h-7" />}
              title="Discover & Filter"
              desc="Filter by category, city, format, and deadline. Find exactly what you're looking for in seconds."
            />
            <FeatureCard 
              icon={<Target className="w-7 h-7" />}
              title="Save & Track"
              desc="Bookmark events you love. Never miss a registration deadline again with our tracking features."
            />
            <FeatureCard 
              icon={<Award className="w-7 h-7" />}
              title="Community & Teams"
              desc="Find teammates, climb the leaderboard, earn badges, and compete globally."
            />
          </div>
        </div>
      </section>

      {/* CTA (Matches Homepage FinalCTA) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900 p-8 md:p-16 text-center border border-slate-800 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to find your next opportunity?
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students who are discovering and winning hackathons every week.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/events" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/25">
                  Browse Events <ArrowRight className="w-5 h-5" />
                </Link>
                {user ? (
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 active:scale-95 transition-all">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link href="/register" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 active:scale-95 transition-all">
                    Create Free Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Reusable Sub-components for About Page
   ───────────────────────────────────────────────────────── */

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col justify-center items-center h-full hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-4 shrink-0">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white text-2xl md:text-3xl mb-1">{value}</h3>
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 h-full">
      <div className="w-14 h-14 bg-white dark:bg-slate-800 text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
