"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ALL_CITIES = [
  // Pakistan
  { name: "Karachi", image: "/images/cities/karachi.webp", region: "PK" },
  { name: "Lahore", image: "/images/cities/lahore.webp", region: "PK" },
  { name: "Islamabad", image: "/images/cities/islamabad.webp", region: "PK" },
  // India
  { name: "Mumbai", image: "/images/cities/mumbai.webp", region: "IN" },
  { name: "Bangalore", image: "/images/cities/bangalore.webp", region: "IN" },
  // Middle East
  { name: "Dubai", image: "/images/cities/dubai.webp", region: "AE" },
  // Europe / UK
  { name: "London", image: "/images/cities/london.webp", region: "UK" },
  { name: "Berlin", image: "/images/cities/berlin.webp", region: "EU" },
  // North America
  { name: "San Francisco", image: "/images/cities/san-francisco.webp", region: "NA" },
  { name: "New York", image: "/images/cities/new-york.webp", region: "NA" },
  { name: "Toronto", image: "/images/cities/toronto.webp", region: "NA" },
  // China
  { name: "Beijing", image: "/images/cities/beijing.webp", region: "CN" },
];

export function CityExplorer() {
  const [sortedCities, setSortedCities] = useState(ALL_CITIES);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let userRegion = "";

    // Detect region based on timezone
    if (timezone.includes("Karachi")) userRegion = "PK";
    else if (timezone.includes("Kolkata") || timezone.includes("Calcutta")) userRegion = "IN";
    else if (timezone.includes("Dubai") || timezone.includes("Muscat")) userRegion = "AE";
    else if (timezone.includes("London") || timezone.includes("Edinburgh")) userRegion = "UK";
    else if (timezone.includes("Europe/")) userRegion = "EU";
    else if (timezone.includes("America/")) userRegion = "NA";
    else if (timezone.includes("Shanghai") || timezone.includes("Chongqing") || timezone.includes("Urumqi") || timezone.includes("Hong_Kong")) userRegion = "CN";

    if (userRegion) {
      // Move local cities to the front, keep others after
      const local = ALL_CITIES.filter((c) => c.region === userRegion);
      const global = ALL_CITIES.filter((c) => c.region !== userRegion);
      setSortedCities([...local, ...global]);
    }
  }, []);

  return (
    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Global Reach</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Location</h3>
      </div>
      
      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
        {sortedCities.map((city) => (
          <Link key={city.name} href={`/events?city=${encodeURIComponent(city.name)}`} className="relative group w-[140px] sm:w-full shrink-0 snap-center aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
              <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">{city.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
