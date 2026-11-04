"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Copy, CheckCircle2, MessageCircle, Briefcase } from "lucide-react";
import { showToast } from "@/components/ui/GlobalToast";

export function ShareProfileButton({ username, name }: { username: string, name: string }) {
  const [baseUrl, setBaseUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileUrl = `${baseUrl}/u/${username}`;
  const shareText = `Check out ${name}'s profile on Opentity! Discover their skills, projects, and hackathon achievements.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    showToast("Profile link copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`, "_blank");
    setIsOpen(false);
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all shadow-sm"
        title="Share Profile"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <button onClick={handleCopy} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition text-left">
            {copied ? <CheckCircle2 className="w-4 h-4 text-orange-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>
          <button onClick={handleWhatsApp} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition text-left">
            <MessageCircle className="w-4 h-4 text-orange-400" /> Share on WhatsApp
          </button>
          <button onClick={handleLinkedIn} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition text-left">
            <Briefcase className="w-4 h-4 text-blue-600" /> Share on LinkedIn
          </button>
        </div>
      )}
    </div>
  );
}
