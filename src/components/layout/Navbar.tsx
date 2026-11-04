"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { APP_NAME } from "@/lib/constants";
import {
  LogOut, User as UserIcon, PlusCircle, LayoutDashboard, Award,
  Target, Users, Bookmark, ExternalLink, ChevronDown, Menu, X,
  Loader2, ArrowRight, Sun, Moon, Sparkles, Compass, Home,
  Mail, Shield, FileText, Inbox, Calendar, Image as ImageIcon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useTheme } from "next-themes";

function LinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2 className="w-4 h-4 animate-spin ml-1.5 inline-block" />;
}

export function Navbar({ user, profile }: { user: any; profile: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [savedEventsUrl, setSavedEventsUrl] = useState("/events");

  const profileRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  // Handle Click Outside for profile & reset on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
    setHoveredMenu(null);

    const match = document.cookie.match(new RegExp('(^| )events_filters=([^;]+)'));
    if (match) setSavedEventsUrl(`/events?${match[2]}`);
    else setSavedEventsUrl("/events");
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileOpen]);

  const handleMouseEnter = (menu: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(menu);
  };
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredMenu(null), 150);
  };

  const isAdmin = profile?.role === "admin";
  const isEventsActive = pathname === "/events" || pathname.startsWith("/events/") || pathname === "/submit";
  const isDashboardActive = pathname.startsWith("/dashboard") && !pathname.includes("/teams") && !pathname.includes("/community");
  const isCommunityActive = pathname.includes("/teams") || pathname.includes("/community") || pathname === "/leaderboard";
  const isAdminActive = pathname.startsWith("/admin");
  const isHomeActive = pathname === "/";

  return (
    <>
      {/* INCREASED HEADER HEIGHT (h-20) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* LEFT: Logo - INCREASED SIZE */}
          <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition">
            <img 
              src="/logos/logo-full-transparent.png" 
              alt={APP_NAME} 
              className="h-12 md:h-14 w-auto dark:brightness-0 dark:invert" 
            />
          </Link>

          {/* CENTER: Desktop Navigation - LARGER TEXT */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavItem href="/" active={isHomeActive}>Home</NavItem>

            <Dropdown
              label="Events"
              active={isEventsActive}
              open={hoveredMenu === "events"}
              onEnter={() => handleMouseEnter("events")}
              onLeave={handleMouseLeave}
            >
              <DropdownItem href={savedEventsUrl} active={pathname === "/events"}>Browse Events</DropdownItem>
              <DropdownItem href="/submit" active={pathname === "/submit"}>Submit an Event</DropdownItem>
              {user && <DropdownItem href="/events/saved" active={pathname === "/events/saved"}>Saved Events</DropdownItem>}
            </Dropdown>

            {!user && <NavItem href="/leaderboard" active={pathname === "/leaderboard"}>Leaderboard</NavItem>}

            {user && !isAdmin && (
              <>
                <Dropdown
                  label="Dashboard"
                  active={isDashboardActive}
                  open={hoveredMenu === "dashboard"}
                  onEnter={() => handleMouseEnter("dashboard")}
                  onLeave={handleMouseLeave}
                >
                  <DropdownItem href="/dashboard" active={pathname === "/dashboard"}>Overview</DropdownItem>
                  <DropdownItem href="/dashboard/quests" active={pathname === "/dashboard/quests"}>Daily Quests</DropdownItem>
                  <DropdownItem href="/dashboard/badges" active={pathname === "/dashboard/badges"}>My Badges</DropdownItem>
                  <DropdownItem href="/dashboard/submissions" active={pathname === "/dashboard/submissions"}>My Submissions</DropdownItem>
                </Dropdown>

                <Dropdown
                  label="Community"
                  active={isCommunityActive}
                  open={hoveredMenu === "community"}
                  onEnter={() => handleMouseEnter("community")}
                  onLeave={handleMouseLeave}
                >
                  <DropdownItem href="/dashboard/teams" active={pathname === "/dashboard/teams"}>Teams Hub</DropdownItem>
                  <DropdownItem href="/dashboard/community" active={pathname === "/dashboard/community"}>Leaderboard</DropdownItem>
                </Dropdown>
              </>
            )}

            <NavItem href="/about" active={pathname === "/about"}>About</NavItem>

            <Dropdown
              label="Resources"
              active={pathname === "/contact" || pathname === "/privacy" || pathname === "/terms"}
              open={hoveredMenu === "resources"}
              onEnter={() => handleMouseEnter("resources")}
              onLeave={handleMouseLeave}
            >
              <DropdownItem href="/contact" active={pathname === "/contact"}>Contact Us</DropdownItem>
              <DropdownItem href="/privacy" active={pathname === "/privacy"}>Privacy Policy</DropdownItem>
              <DropdownItem href="/terms" active={pathname === "/terms"}>Terms of Service</DropdownItem>
            </Dropdown>

            {isAdmin && (
              <Dropdown
                label="Admin"
                active={isAdminActive}
                open={hoveredMenu === "admin"}
                onEnter={() => handleMouseEnter("admin")}
                onLeave={handleMouseLeave}
              >
                <DropdownItem href="/admin" active={pathname === "/admin"}>Overview</DropdownItem>
                <DropdownItem href="/admin/events" active={pathname === "/admin/events"}>Manage Events</DropdownItem>
                <DropdownItem href="/admin/submissions" active={pathname === "/admin/submissions"}>Submissions</DropdownItem>
                <DropdownItem href="/admin/users" active={pathname === "/admin/users"}>Users</DropdownItem>
                <DropdownItem href="/admin/homepage" active={pathname === "/admin/homepage"}>Homepage Settings</DropdownItem>
              </Dropdown>
            )}
          </nav>

          {/* RIGHT: Actions - LARGER BUTTONS */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle (Larger Icons) */}
            {mounted && (
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-full transition-all duration-300 ${resolvedTheme === "light" ? "bg-white shadow-sm text-orange-500" : "text-slate-400 hover:text-slate-600"}`}
                  title="Light Mode"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-full transition-all duration-300 ${resolvedTheme === "dark" ? "bg-slate-900 shadow-sm text-yellow-400" : "text-slate-400 hover:text-slate-300"}`}
                  title="Dark Mode"
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            )}

            {user ? (
              <>
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center outline-none rounded-full focus:ring-2 focus:ring-orange-500 transition"
                  >
                    <UserAvatar name={profile?.full_name || user.email} url={profile?.avatar_url} size="lg" />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.full_name || "Student"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      {profile?.username && (
                        <Link href={`/u/${profile.username}`} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <ExternalLink className="w-4 h-4 text-slate-400" /> View Profile
                        </Link>
                      )}
                      <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        <UserIcon className="w-4 h-4 text-slate-400" /> Settings
                      </Link>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                      <form action={logout} onSubmit={() => { document.cookie = "events_filters=; path=/; max-age=0"; }}>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4 ml-2">
                <Link href="/login" className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                  Log in
                </Link>
                <Link href="/register" className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg text-base font-bold hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-500/20">
                  Sign up free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMobileOpen(false)} />
          
          <div className="relative w-[85%] max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <img src="/logos/logo-full-transparent.png" alt={APP_NAME} className="h-10 w-auto dark:brightness-0 dark:invert" />
              
              <div className="flex items-center gap-2">
                {mounted && (
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-1.5 rounded-full transition-all ${resolvedTheme === "light" ? "bg-white shadow-sm text-orange-500" : "text-slate-400"}`}
                    >
                      <Sun className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-1.5 rounded-full transition-all ${resolvedTheme === "dark" ? "bg-slate-900 shadow-sm text-yellow-400" : "text-slate-400"}`}
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {user && profile && (
              <Link href="/dashboard/profile" className="flex items-center gap-3 mx-4 mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <UserAvatar name={profile?.full_name || user.email} url={profile?.avatar_url} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.full_name || "Student"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
              </Link>
            )}

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <MobileLink href="/" icon={Home}>Home</MobileLink>
              
              <MobileAccordion title="Events" icon={Compass} open={openSection === "events"} onToggle={() => setOpenSection(openSection === "events" ? null : "events")}>
                <MobileSubLink href={savedEventsUrl} icon={Compass} active={pathname === "/events"}>Browse Events</MobileSubLink>
                <MobileSubLink href="/submit" icon={PlusCircle} active={pathname === "/submit"}>Submit an Event</MobileSubLink>
                {user && <MobileSubLink href="/events/saved" icon={Bookmark} active={pathname === "/events/saved"}>Saved Events</MobileSubLink>}
              </MobileAccordion>

              {!user && <MobileLink href="/leaderboard" icon={Award}>Leaderboard</MobileLink>}

              {user && !isAdmin && (
                <>
                  <MobileAccordion title="Dashboard" icon={LayoutDashboard} open={openSection === "dashboard"} onToggle={() => setOpenSection(openSection === "dashboard" ? null : "dashboard")}>
                    <MobileSubLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"}>Overview</MobileSubLink>
                    <MobileSubLink href="/dashboard/quests" icon={Target} active={pathname === "/dashboard/quests"}>Daily Quests</MobileSubLink>
                    <MobileSubLink href="/dashboard/badges" icon={Award} active={pathname === "/dashboard/badges"}>My Badges</MobileSubLink>
                    <MobileSubLink href="/dashboard/submissions" icon={FileText} active={pathname === "/dashboard/submissions"}>My Submissions</MobileSubLink>
                  </MobileAccordion>

                  <MobileAccordion title="Community" icon={Users} open={openSection === "community"} onToggle={() => setOpenSection(openSection === "community" ? null : "community")}>
                    <MobileSubLink href="/dashboard/teams" icon={Users} active={pathname === "/dashboard/teams"}>Teams Hub</MobileSubLink>
                    <MobileSubLink href="/dashboard/community" icon={Award} active={pathname === "/dashboard/community"}>Leaderboard</MobileSubLink>
                  </MobileAccordion>
                </>
              )}

              <MobileLink href="/about" icon={Sparkles}>About</MobileLink>

              <MobileAccordion title="Resources" icon={FileText} open={openSection === "resources"} onToggle={() => setOpenSection(openSection === "resources" ? null : "resources")}>
                <MobileSubLink href="/contact" icon={Mail} active={pathname === "/contact"}>Contact Us</MobileSubLink>
                <MobileSubLink href="/privacy" icon={Shield} active={pathname === "/privacy"}>Privacy Policy</MobileSubLink>
                <MobileSubLink href="/terms" icon={FileText} active={pathname === "/terms"}>Terms of Service</MobileSubLink>
              </MobileAccordion>

              {isAdmin && (
                <MobileAccordion title="Admin" icon={LayoutDashboard} open={openSection === "admin"} onToggle={() => setOpenSection(openSection === "admin" ? null : "admin")}>
                  <MobileSubLink href="/admin" icon={LayoutDashboard} active={pathname === "/admin"}>Overview</MobileSubLink>
                  <MobileSubLink href="/admin/events" icon={Calendar} active={pathname === "/admin/events"}>Manage Events</MobileSubLink>
                  <MobileSubLink href="/admin/submissions" icon={Inbox} active={pathname === "/admin/submissions"}>Submissions</MobileSubLink>
                  <MobileSubLink href="/admin/users" icon={Users} active={pathname === "/admin/users"}>Users</MobileSubLink>
                  <MobileSubLink href="/admin/homepage" icon={ImageIcon} active={pathname === "/admin/homepage"}>Homepage Settings</MobileSubLink>
                </MobileAccordion>
              )}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              {user ? (
                <form action={logout} onSubmit={() => { document.cookie = "events_filters=; path=/; max-age=0"; }}>
                  <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition">
                    <LogOut className="w-5 h-5" /> Sign out
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" className="flex items-center justify-center w-full py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    Sign in
                  </Link>
                  <Link href="/register" className="flex items-center justify-center w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-md shadow-orange-500/20">
                    Sign up free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Reusable Navbar Components
   ───────────────────────────────────────────────────────── */
function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-base font-medium transition-colors inline-flex items-center ${
        active ? "text-orange-500 dark:text-orange-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      {children}
      <LinkPending />
      {active && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-t-full" />
      )}
    </Link>
  );
}

function Dropdown({ label, active, open, onEnter, onLeave, children }: { label: string; active: boolean; open: boolean; onEnter: () => void; onLeave: () => void; children: React.ReactNode }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        className={`relative flex items-center gap-1.5 px-4 py-2 text-base font-medium transition-colors ${
          active ? "text-orange-500 dark:text-orange-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        {label} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        {active && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-t-full" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${
        active 
          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" 
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
      <Icon className="w-5 h-5 text-slate-400" /> {children}
    </Link>
  );
}

function MobileAccordion({ title, icon: Icon, open, onToggle, children }: { title: string; icon: any; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        <span className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-slate-400" /> {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-1 ml-5 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileSubLink({ href, icon: Icon, active, children }: { href: string; icon: any; active?: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
        active 
          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-semibold" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? "text-orange-500" : "text-slate-400"}`} /> {children}
    </Link>
  );
}
