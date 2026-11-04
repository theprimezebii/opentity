import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Lock, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: "Set New Password" };

export const instant = false;

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Link expired</h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Your password reset link has expired or is invalid. For your security, reset links expire after 1 hour.
            </p>
            <Link href="/forgot-password" className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition">
              Request New Link
            </Link>
            <p className="mt-6 text-xs text-slate-400">
              Having trouble? <Link href="/contact" className="text-orange-400 hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT: Info panel */}
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
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Set a <span className="text-fuchsia-300">new password</span>
            </h2>
            <p className="text-orange-100 text-lg mb-8 leading-relaxed">
              Choose a strong password to keep your account secure. Make it unique and hard to guess.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                <span className="text-orange-100">At least 6 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                <span className="text-orange-100">Mix letters, numbers, and symbols</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                <span className="text-orange-100">Don't reuse old passwords</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/20 flex items-center gap-2 text-orange-200 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Your account is protected with end-to-end encryption</span>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose new password</h1>
            <p className="text-slate-500">Enter a strong password for your account.</p>
          </div>

          <ResetPasswordForm />

          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm">
            <p className="text-slate-500">
              Having trouble?{" "}
              <Link href="/contact" className="text-orange-500 font-semibold hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
