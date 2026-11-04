"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { login, signup } from "@/app/actions/auth";
import { FormMessage } from "@/components/ui/FormMessage";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordRequirements, isPasswordValid } from "@/components/auth/PasswordRequirements";
import { Mail, Lock, User, Gift, Trophy, Flame, Users, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface AuthSliderProps {
  defaultMode: "login" | "register";
  stats: { events: number; users: number };
  referrerName?: string | null;
  refCode?: string | null;
  initialError?: string;
  nextUrl?: string;
}

export function AuthSlider({ defaultMode, stats, referrerName, refCode, initialError, nextUrl }: AuthSliderProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [urlError, setUrlError] = useState<string | null>(initialError || null);

  const [loginState, loginAction] = useActionState(login, null);
  const [signupState, signupAction] = useActionState(signup, null);

  useEffect(() => { setUrlError(initialError || null); }, [initialError]);

  const switchTo = (m: "login" | "register") => {
    if (m === mode) return;
    setMode(m);
    setUrlError(null);
    const url = new URL(window.location.href);
    url.pathname = m === "login" ? "/login" : "/register";
    url.searchParams.delete("message");
    window.history.replaceState({}, "", url.toString());
  };

  const isRegister = mode === "register";
  const displayError = urlError || (isRegister ? signupState?.error : loginState?.error);
  
  const [signupPassword, setSignupPassword] = useState("");
  const passwordValid = isPasswordValid(signupPassword);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  return (
    <div className={`auth-container ${isRegister ? "right-panel-active" : ""}`}>

      {/* ============ SIGN IN FORM ============ */}
      <div className="auth-form-panel auth-form-signin bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="auth-form-inner min-h-full flex flex-col items-center justify-center p-4 py-10">
          <div className="w-full max-w-md my-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            
            <div className="mb-8 text-center">
              <img src="/logos/logo-full-transparent.png" alt="Opentity" className="h-11 w-auto mb-5 mx-auto block" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue your opportunity journey.</p>
            </div>

            {!isRegister && <FormMessage error={displayError} />}
            <OAuthButtons />

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-700"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">Or continue with email</span></div>
            </div>

            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="next" value={nextUrl || ""} />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="password" type={showLoginPassword ? "text" : "password"} required placeholder="Enter your password" className="w-full pl-11 pr-12 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400" />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1" tabIndex={-1}>
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs font-semibold text-orange-500 hover:underline">Forgot password?</Link>
                </div>
              </div>
              <FormSubmitButton loadingText="Signing in..." className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-2 shadow-sm">
                Sign in
              </FormSubmitButton>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchTo("register")} className="text-orange-500 font-bold hover:underline cursor-pointer">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SIGN UP FORM ============ */}
      <div className="auth-form-panel auth-form-signup bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="auth-form-inner min-h-full flex flex-col items-center justify-center p-4 py-10">
          <div className="w-full max-w-md my-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            
            <div className="mb-8 text-center">
              <img src="/logos/logo-full-transparent.png" alt="Opentity" className="h-11 w-auto mb-5 mx-auto block" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Start discovering opportunities. It's free.</p>
            </div>

            {isRegister && referrerName && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-500/10 dark:to-rose-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-400"><strong>{referrerName}</strong> invited you!</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">You'll both get bonus points when you sign up.</p>
                </div>
              </div>
            )}

            {isRegister && <FormMessage error={displayError} />}
            <OAuthButtons />

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-700"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">Or continue with email</span></div>
            </div>

            <form action={signupAction} className="space-y-4">
              <input type="hidden" name="next" value={nextUrl || ""} />
              {refCode && <input type="hidden" name="ref" value={refCode} />}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="full_name" type="text" required placeholder="e.g., Ali Khan" className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="password" type={showSignupPassword ? "text" : "password"} required placeholder="Create a password" minLength={6} onChange={(e) => setSignupPassword(e.target.value)} className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 ${signupPassword.length > 0 ? (passwordValid ? 'border-emerald-300 focus:ring-orange-400 focus:border-orange-400' : 'border-slate-300 dark:border-slate-700 focus:ring-orange-500 focus:border-orange-500') : 'border-slate-300 dark:border-slate-700 focus:ring-orange-500 focus:border-orange-500'}`} />
                  <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1" tabIndex={-1}>
                    {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {signupPassword.length > 0 && <PasswordRequirements password={signupPassword} />}
              </div>
              <FormSubmitButton loadingText="Creating account..." disabled={signupPassword.length > 0 && !passwordValid} className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-2 shadow-sm">
                Create account
              </FormSubmitButton>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed pt-2">
                By signing up, you agree to our <Link href="/terms" className="text-orange-500 hover:underline font-medium">Terms</Link> and <Link href="/privacy" className="text-orange-500 hover:underline font-medium">Privacy Policy</Link>.
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button type="button" onClick={() => switchTo("login")} className="text-orange-500 font-bold hover:underline cursor-pointer">Sign in</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ OVERLAY (HERO) WITH FLOATING CARDS ============ */}
      <div className="auth-overlay-container">
        <div className="auth-overlay">
          
          <div className="auth-overlay-panel auth-overlay-left">
            <HeroPanel variant="register" stats={stats} />
          </div>
          
          <div className="auth-overlay-panel auth-overlay-right">
            <HeroPanel variant="login" stats={stats} />
          </div>

        </div>
      </div>

    </div>
  );
}

function HeroPanel({ variant, stats }: { variant: "login" | "register"; stats: { events: number; users: number } }) {
  const isLogin = variant === "login";

  return (
    <div className="auth-panel-inner relative z-10 w-full h-full flex flex-col justify-between py-12">
      
      {/* TEXT SECTION - Moved to top */}
      <div className="relative z-40 pt-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-md">
            {isLogin ? (
              <>Welcome back to your <br className="hidden sm:block" /><span className="text-orange-300">opportunity radar.</span></>
            ) : (
              <>Never miss a <br className="hidden sm:block" /><span className="text-orange-300">hackathon</span> again.</>
            )}
          </h2>
          <p className="text-slate-100 text-base xl:text-lg leading-relaxed">
            {isLogin
              ? "Continue discovering hackathons, competitions, and AI events across the globe."
              : "Join thousands of students discovering hackathons, competitions, and AI events across the globe."}
          </p>
        </div>
      </div>

      {/* FLOATING CARDS SECTION - Dedicated flex area below text */}
      <div className="relative flex-grow flex items-center justify-center my-6">
        <div className="relative w-full max-w-sm h-64">
          <div className="absolute top-0 left-0 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 auth-float-slow border border-slate-200 dark:border-slate-700 z-50">
            <div className="flex items-start justify-between mb-2">
              <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase rounded">AI</span>
              <span className="text-[10px] font-semibold text-orange-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" /> OPEN
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 leading-tight">AI Seekho Hackathon 2026</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> PKR 2,500,000
            </div>
          </div>

          <div className="absolute top-16 right-0 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 auth-float-medium border border-slate-200 dark:border-slate-700 z-50">
            <div className="flex items-start justify-between mb-2">
              <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase rounded">CYBER</span>
              <span className="text-[10px] font-semibold text-orange-600 flex items-center gap-1">
                <Flame className="w-3 h-3" /> CLOSING
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 leading-tight">Cyber Hackathon 2026</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> PKR 275,000
            </div>
          </div>

          <div className="absolute bottom-0 left-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 auth-float-fast border border-slate-200 dark:border-slate-700 z-50">
            <div className="flex items-start justify-between mb-2">
              <span className="px-2.5 py-1 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-[10px] font-bold uppercase rounded">HACKATHON</span>
              <span className="text-[10px] font-semibold text-orange-600 flex items-center gap-1">
                <Users className="w-3 h-3" /> 3 TEAMS
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 leading-tight">Rocketathon Zero</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Seed Funding
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION - Moved to bottom */}
      <div className="pt-8 border-t border-white/20 relative z-40">
        <div className="flex items-center justify-center gap-10">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats.events > 0 ? `${stats.events}+` : "500+"}</p>
            <p className="text-xs text-slate-200 uppercase tracking-wider font-semibold mt-1">Events</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats.users > 0 ? `${stats.users}+` : "10K+"}</p>
            <p className="text-xs text-slate-200 uppercase tracking-wider font-semibold mt-1">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white flex items-center justify-center gap-1.5">100%</p>
            <p className="text-xs text-slate-200 uppercase tracking-wider font-semibold mt-1">Free</p>
          </div>
        </div>
      </div>
    </div>
  );
}
