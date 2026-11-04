"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Globe, X } from "lucide-react";

export function LocationDetector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  useEffect(() => {
    // If the URL already has a country, or if the user manually cleared it before, do nothing
    if (searchParams.get("country") || sessionStorage.getItem("region_cleared")) {
      return;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let country = "";
    let countryName = "";

    if (timezone.includes("Karachi")) { country = "PK"; countryName = "Pakistan"; }
    else if (timezone.includes("Kolkata") || timezone.includes("Calcutta")) { country = "IN"; countryName = "India"; }
    else if (timezone.includes("Dubai")) { country = "AE"; countryName = "UAE"; }
    else if (timezone.includes("London")) { country = "UK"; countryName = "the UK"; }
    else if (timezone.includes("Europe/")) { country = "EU"; countryName = "Europe"; }
    else if (timezone.includes("America/")) { country = "US"; countryName = "North America"; }
    else if (timezone.includes("Shanghai") || timezone.includes("Chongqing") || timezone.includes("Hong_Kong")) { country = "CN"; countryName = "China"; }

    if (country) {
      setDetectedCountry(countryName);
      const params = new URLSearchParams(searchParams.toString());
      params.set("country", country);
      
      // Use replace so it doesn't add an extra step to the back button
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  if (!detectedCountry) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-3 flex items-center justify-between gap-3 mb-6 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-300">
        <Globe className="w-4 h-4 text-orange-500" />
        <span>Showing local events from <strong className="font-bold">{detectedCountry}</strong> first.</span>
      </div>
      <button
        onClick={() => {
          // Remove country filter and remember they cleared it
          sessionStorage.setItem("region_cleared", "true");
          const params = new URLSearchParams(searchParams.toString());
          params.delete("country");
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
          setDetectedCountry(null);
        }}
        className="shrink-0 flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition px-2 py-1 rounded bg-orange-100 hover:bg-orange-200 dark:bg-orange-500/20 dark:dark:hover:bg-orange-500/30"
      >
        <X className="w-3 h-3" /> Show Global First
      </button>
    </div>
  );
}
