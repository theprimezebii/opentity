import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight, Sparkles, Trophy, Users, Calendar, MapPin, Zap, Target, Award, Building2, Brain, Globe, Smartphone, BarChart3, Shield, Link2, Quote, Flame } from "lucide-react";
import { APP_DESCRIPTION } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { getGalleryImages } from "@/lib/queries/gallery";
import { Reveal } from "@/components/ui/Reveal";
import { Gallery } from "@/components/public/Gallery";
import { UrgencyStrip } from "@/components/public/UrgencyStrip";
import { Marquee } from "@/components/public/Marquee";
import { CityExplorer } from "@/components/public/CityExplorer";
import { CountUp } from "@/components/public/CountUp";
import { HomeSkeleton } from "@/components/public/HomeSkeleton";
import { PageHero } from "@/components/public/PageHero";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { FeaturedEventCard } from "@/components/events/FeaturedEventCard";
import { formatDate } from "@/lib/utils";

const TESTIMONIALS = [
  { name: "Ali Khan", uni: "FAST NUCES", avatar: "https://i.pravatar.cc/150?img=12", text: "I found the AI Seekho hackathon here before it was posted in any university group. Ended up winning 2nd place." },
  { name: "Ayesha Malik", uni: "NUST", avatar: "https://i.pravatar.cc/150?img=32", text: "The deadline reminders alone saved me from missing three registrations this semester. No more scrolling Instagram for hours." },
  { name: "Bilal Riaz", uni: "LUMS", avatar: "https://i.pravatar.cc/150?img=68", text: "Finally a place where every hackathon in Pakistan lives in one place. The teams feature made finding teammates dead simple." },
];

const CITIES = [
  { name: "Karachi", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80" },
  { name: "Lahore", image: "https://images.unsplash.com/photo-1590070682980-1880b5486191?w=400&q=80" },
  { name: "Islamabad", image: "https://images.unsplash.com/photo-1585933922249-b5c9b05823d9?w=400&q=80" },
  { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
  { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80" },
  { name: "San Francisco", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80" },
  { name: "Online", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
];

const UNIVERSITIES = [
  { name: "NUST", logo: "/logos/universities/nust.webp" },
  { name: "FAST", logo: "/logos/universities/fast.webp" },
  { name: "LUMS", logo: "/logos/universities/lums.webp" },
  { name: "GIKI", logo: "/logos/universities/giki.webp" },
  { name: "COMSATS", logo: "/logos/universities/comsats.webp" },
  { name: "UET Lahore", logo: "/logos/universities/uet.webp" },
  { name: "IBA Karachi", logo: "/logos/universities/iba.webp" },
  { name: "Air University", logo: "/logos/universities/air-uni.webp" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <PageHero
        badge="The Global Hub for Tech Events"
        title={<>Never miss a <br className="hidden md:block" /><span className="relative inline-block"><span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">hackathon</span><svg className="absolute -bottom-3 left-0 w-full h-3 text-orange-400/50" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 60 2, 140 2, 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span>{" "}again.</>}
        subtitle="Opentity currently aggregates over 500+ global hackathons and tech competitions. Discover events, track deadlines, and save opportunities—all in one place."
      >
        <Link href="/events" className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/30">
          Browse Events <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Suspense fallback={<div className="h-[60px] w-48 bg-white/20 rounded-xl animate-pulse" />}><AuthButton variant="hero" /></Suspense>
      </PageHero>
      <Suspense fallback={<HomeSkeleton />}>
        <div>
          <Suspense fallback={null}><UrgencyStrip /></Suspense>
          <Suspense fallback={<div className="h-32 bg-white dark:bg-slate-900 animate-pulse" />}><LiveStats /></Suspense>
          <Suspense fallback={<div className="h-[500px] bg-slate-50 dark:bg-slate-950 animate-pulse" />}><FeaturedEvents /></Suspense>
          <HowItWorks />
          <Suspense fallback={null}><GallerySection /></Suspense>
          <Testimonials />
          <TrustedBy />
          <Categories />
          <FinalCTA />
        </div>
      </Suspense>
    </div>
  );
}

async function AuthButton({ variant }: { variant: "hero" | "final" }) {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Base classes for perfect centering on all devices
  const baseClasses = "flex justify-center items-center gap-2 font-bold active:scale-[0.97] transition-all w-full sm:w-auto text-center";
  
  if (variant === "hero") {
    return user ? (
      <Link href="/dashboard" className={`${baseClasses} px-7 py-3.5 bg-white/10 text-white backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20`}>
        Go to Dashboard <ArrowRight className="w-4 h-4 shrink-0" />
      </Link>
    ) : (
      <Link href="/register" className={`${baseClasses} px-7 py-3.5 bg-white/10 text-white backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20`}>
        Create Free Account
      </Link>
    );
  }
  
  return user ? (
    <Link href="/dashboard" className={`${baseClasses} px-6 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-400`}>
      Open Dashboard <ArrowRight className="w-4 h-4 shrink-0" />
    </Link>
  ) : (
    <Link href="/register" className={`${baseClasses} px-6 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-400`}>
      Get Started Free <ArrowRight className="w-4 h-4 shrink-0" />
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative h-[550px] md:h-[650px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
      <Image src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80" alt="Hackathon Background" fill priority className="object-cover opacity-50 dark:opacity-30" />
      <video autoPlay loop muted playsInline poster="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-30">
        <source src="https://cdn.pixabay.com/video/2022/12/11/142505-780456717_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-[1px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium mb-6 shadow-xl">
          <Sparkles className="w-4 h-4 text-orange-400" />
          The Global Hub for Tech Events
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
          Never miss a <br className="hidden md:block" />
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">hackathon</span>
            <svg className="absolute -bottom-3 left-0 w-full h-3 text-orange-400/50" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 60 2, 140 2, 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
          </span>{" "}again.
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          Opentity currently aggregates over 500+ global hackathons and tech competitions. Discover events, track deadlines, and save opportunities—all in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/events" className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/30">
            Browse Events <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Suspense fallback={<div className="h-[60px] w-48 bg-white/20 rounded-xl animate-pulse" />}><AuthButton variant="hero" /></Suspense>
        </div>
      </div>
    </section>
  );
}

async function LiveStats() {
  await connection();
  const supabase = await createClient();
  const [{ count: eventCount }, { count: userCount }, settings] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    getSiteSettings(),
  ]);

  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <FloorStat label="Events" raw={eventCount || 0} floor={settings.events_floor} forceReal={settings.show_real} icon={<Trophy className="w-5 h-5" />} />
        <FloorStat label="Students" raw={userCount || 0} floor={settings.students_floor} forceReal={settings.show_real} icon={<Users className="w-5 h-5" />} />
        <FloorStat label="Cities" raw={settings.cities_floor} floor={settings.cities_floor} forceReal={settings.show_real} icon={<Building2 className="w-5 h-5" />} alwaysSuffix={settings.show_real ? "" : "+"} />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg mb-2"><Sparkles className="w-5 h-5" /></div>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">100%</p>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Free</p>
        </div>
      </div>
    </section>
  );
}

function formatStatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.floor(n / 1_000) + "K";
  return String(n);
}

function FloorStat({ label, raw, floor, icon, alwaysSuffix = "", forceReal = false }: { label: string; raw: number; floor: number; icon: React.ReactNode; alwaysSuffix?: string; forceReal?: boolean }) {
  const belowFloor = !forceReal && raw < floor;
  const display = belowFloor ? floor : raw;
  const suffix = alwaysSuffix || (belowFloor ? "+" : "");

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg mb-2">{icon}</div>
      <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
        {belowFloor ? <>{formatStatNumber(display)}{suffix}</> : <CountUp end={raw} suffix={suffix} />}
      </p>
      <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

async function FeaturedEvents() {
  await connection();
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").neq("status", "draft").gte("start_date", new Date().toISOString()).order("is_featured", { ascending: false }).order("start_date", { ascending: true }).limit(3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Happening soon</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Featured events</h2>
          </div>
          <Link href="/events" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-500 transition">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

      {!events || events.length === 0 ? (
        <Reveal>
          <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No upcoming events right now — check back soon or <Link href="/submit" className="text-orange-500 font-semibold hover:underline">submit one</Link>.</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event: any, i: number) => (
            <Reveal key={event.id} delay={i * 100} type="up" className="h-full">
              <FeaturedEventCard event={event} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: <Target className="w-6 h-6" />, title: "Discover", desc: "Browse hackathons, workshops, and competitions from across the globe — all in one place." },
    { icon: <Zap className="w-6 h-6" />, title: "Save & Track", desc: "Bookmark events, get reminders, and never miss a registration deadline again." },
    { icon: <Award className="w-6 h-6" />, title: "Level Up", desc: "Join teams, earn badges, climb the leaderboard, and unlock your potential." },
  ];

  return (
    <section id="how-it-works" className="bg-white dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">From discovery to victory, in 3 steps</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 150} type={i === 0 ? "right" : i === 2 ? "left" : "up"}>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-500/30 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white text-orange-500 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

async function GallerySection() {
  await connection();
  const images = await getGalleryImages();
  if (images.length === 0) return <Gallery />;
  return <Gallery images={images.map((img) => ({ src: img.url, fallback: img.url, alt: img.alt || "Gallery image" }))} />;
}

function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Students say</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Built by students, for students</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 120} type={i === 1 ? "up" : i === 0 ? "right" : "left"}>
              <div className="h-full p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col">
                <Quote className="w-8 h-8 text-orange-300 dark:text-orange-500/50 mb-3 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5 flex-grow">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <img src={t.avatar} alt={t.name} loading="lazy" className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.uni}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Trusted by</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Students from top universities</h2>
        </div>
      </Reveal>
      <Marquee items={UNIVERSITIES} />
    </section>
  );
}

function Categories() {
  const categories = [
    { value: "AI", label: "AI & Machine Learning", Icon: Brain },
    { value: "Web Development", label: "Web Development", Icon: Globe },
    { value: "Mobile", label: "Mobile Apps", Icon: Smartphone },
    { value: "Data Science", label: "Data Science", Icon: BarChart3 },
    { value: "Cybersecurity", label: "Cybersecurity", Icon: Shield },
    { value: "Blockchain", label: "Blockchain", Icon: Link2 },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Explore by interest</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Find your niche</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(({ value, label, Icon }, i) => (
          <Reveal key={value} delay={i * 80} type={i % 2 === 0 ? "right" : "left"}>
            <Link href={`/events?category=${encodeURIComponent(value)}`} className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300">
              <span className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{label}</span>
            </Link>
          </Reveal>
        ))}
      </div>

      <CityExplorer />
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <Reveal type="zoom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-6 sm:p-12 lg:p-20 text-center border border-slate-800">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Ready to find your next opportunity?</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8">Join students from across the globe who are discovering and winning hackathons every week.</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto mb-10">
              <Suspense fallback={<div className="h-[52px] w-full sm:w-[180px] bg-orange-400/50 rounded-xl animate-pulse" />}>
                <AuthButton variant="final" />
              </Suspense>
              <Link href="/submit" className="flex justify-center items-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 active:scale-[0.97] transition-all w-full sm:w-auto text-center">
                Submit an Event
              </Link>
            </div>

            {/* Newsletter Capture */}
            <div className="w-full pt-8 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">Get the best hackathons in your inbox every week.</p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
