import Link from "next/link";
import { ArrowLeft, Mail, AlertTriangle, MessageSquare, ArrowRight, Shield } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: "Recover Account Access" };

export default function ForgotEmailPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500 to-fuchsia-700 p-8 text-white">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Can't access your email?</h1>
            <p className="text-orange-100 text-sm leading-relaxed">
              We understand. Follow these steps to recover your {APP_NAME} account.
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Try other email addresses</h3>
                  <p className="text-sm text-slate-600">
                    Did you sign up with a university email or a different personal email? Try those addresses on the sign-in page.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Check university email</h3>
                  <p className="text-sm text-slate-600">
                    If you graduated, your university email might still be active. Check with your IT department if access was revoked.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Contact our support team</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    If you still can't access your account, reach out to us. We'll verify your identity and help you recover access within 24-48 hours.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                    <MessageSquare className="w-4 h-4" /> Contact Support <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Security reminder</p>
                <p className="text-xs text-amber-700 mt-1">
                  We will <strong>never</strong> ask for your password. When contacting support, please provide your username, university, and approximate signup date.
                </p>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
              <Link href="/forgot-password" className="text-orange-500 font-semibold hover:underline">
                Know your email? Reset password
              </Link>
              <Link href="/login" className="text-slate-500 hover:text-slate-900">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Your account security is our priority</span>
        </div>
      </div>
    </main>
  );
}
