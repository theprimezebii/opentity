export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: November 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>At Opentity, we take your privacy seriously. This policy outlines what data we collect, how we use it, and your rights.</p>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect your email address, name, and university when you create an account. We also collect data on the events you save and your interactions with the platform.</p>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Data</h2>
          <p>Your data is used to personalize your experience, send deadline reminders, and improve the platform. We never sell your data to third parties.</p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Security</h2>
          <p>We use industry-standard encryption (Supabase Auth and Row Level Security) to ensure your data is safe and only accessible to you.</p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions about your data, please contact support@opentity.com.</p>
        </div>
      </div>
    </div>
  );
}
