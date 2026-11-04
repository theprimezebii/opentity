import Link from "next/link";
import { Home, Compass, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      
      {/* Subtle Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-700">
        
        {/* Subtle Icon */}
        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
          <MapPinOff className="w-10 h-10 text-orange-500" />
        </div>

        {/* 404 Gradient Text */}
        <h1 className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-br from-orange-500 via-rose-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm select-none">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-3">
          You've hit a dead end.
        </h2>
        
        {/* The Creative Line */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Looks like this page pivoted too hard and got lost in the source code. But don't worry, there are plenty of real hackathons waiting for you.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          
          <Link 
            href="/events" 
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <Compass className="w-4 h-4" /> Browse Events
          </Link>
        </div>

      </div>
    </div>
  );
}
