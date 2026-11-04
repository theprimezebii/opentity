import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-900 text-slate-400 mt-auto border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <img
              src="/logos/logo-full-transparent.png"
              alt={APP_NAME}
              className="h-9 mb-4 brightness-0 invert"
            />
            <p className="text-sm text-slate-400 dark:text-slate-400 leading-relaxed max-w-xs">
              Discover hackathons, competitions, and AI events across Pakistan. Built for students, by students.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link href="/submit" className="hover:text-white transition">Submit an event</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#how-it-works" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.</p>
          <p>Made with care in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
