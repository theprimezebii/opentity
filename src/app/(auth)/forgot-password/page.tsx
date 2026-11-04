import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ArrowLeft, Mail, ShieldCheck, Clock, Lock } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT: Info panel (matches auth hero style) */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-orange-600 via-fuchsia-700 to-orange-900 overflow-hidden p-12 xl:p-16 flex-col justify-between text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</Link>
          <p className="text-orange-200 text-sm font-medium mt-1">Pakistan's opportunity radar</p>
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Forgot your <span className="text-fuchsia-300">password?</span>
            </h2>
            <p className="text-orange-100 text-lg mb-8 leading-relaxed">
              No worries. We'll send you a secure reset link to your email so you can set a new password in seconds.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Check your inbox</p>
                  <p className="text-orange-200 text-xs">The link arrives within 1-2 minutes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure reset link</p>
                  <p className="text-orange-200 text-xs">The link expires after 1 hour for your safety.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Didn't get it?</p>
                  <p className="text-orange-200 text-xs">Check spam folder or try again in a few minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/20">
          <p className="text-orange-200 text-xs">
            Still stuck? <Link href="/contact" className="text-white font-semibold underline">Contact support</Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset your password</h1>
            <p className="text-slate-500">Enter the email associated with your account and we'll send you a reset link.</p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-center text-sm">
            <p className="text-slate-600">
              Remembered it? <Link href="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
            </p>
            <p className="text-xs text-slate-400">
              Don't have access to your email?{" "}
              <Link href="/forgot-email" className="text-orange-400 font-medium hover:underline">Get help</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
