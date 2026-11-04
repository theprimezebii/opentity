export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: November 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>By using Opentity, you agree to these terms. Please read them carefully.</p>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptable Use</h2>
          <p>You agree not to misuse the platform, spam other users, or submit fake events. We reserve the right to ban accounts that violate these rules.</p>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Event Submissions</h2>
          <p>We are an aggregator platform. We do not organize most of the events listed here. We are not responsible for cancellations, changes, or issues with event organizers.</p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Prizes and Competitions</h2>
          <p>Opentity does not handle prize distribution. Any prize claims must be made directly with the event organizer.</p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Accounts</h2>
          <p>You are responsible for maintaining the security of your account. Do not share your password with anyone.</p>
        </div>
      </div>
    </div>
  );
}
