import { PageHero } from "@/components/public/PageHero";
import { Mail, MessageSquare, Building2 } from "lucide-react";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      <PageHero
        badge="Get in touch"
        title="We'd love to hear from you."
        subtitle="Whether you're a student, an organizer, or a sponsor, our team is here to help."
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Mail className="w-8 h-8 text-orange-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For general inquiries and support.</p>
          <a href="mailto:support@opentity.com" className="text-orange-500 font-semibold hover:underline">support@opentity.com</a>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Building2 className="w-8 h-8 text-orange-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Partner With Us</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For event organizers and sponsors.</p>
          <a href="mailto:partners@opentity.com" className="text-orange-500 font-semibold hover:underline">partners@opentity.com</a>
        </div>
      </main>
    </div>
  );
}
