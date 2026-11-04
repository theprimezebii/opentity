export function HomeSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Hero Skeleton (Matches Video Hero) */}
      <section className="relative h-[600px] w-full bg-slate-200 flex flex-col items-center justify-center px-6">
        <div className="h-8 w-48 bg-slate-300 rounded-full mb-6"></div>
        <div className="h-16 w-3/4 max-w-2xl bg-slate-300 rounded-lg mb-4"></div>
        <div className="h-16 w-1/2 max-w-lg bg-slate-300 rounded-lg mb-8"></div>
        <div className="flex gap-4">
          <div className="h-12 w-40 bg-slate-300 rounded-lg"></div>
          <div className="h-12 w-40 bg-slate-300 rounded-lg"></div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <div className="border-y border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-lg mb-3"></div>
              <div className="h-8 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Cards Skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="h-10 w-64 bg-slate-200 rounded mb-10"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[400px]">
              <div className="aspect-[16/10] bg-slate-200 w-full"></div>
              <div className="p-6">
                <div className="h-6 w-20 bg-slate-200 rounded-md mb-4"></div>
                <div className="h-8 w-3/4 bg-slate-200 rounded-md mb-3"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded mb-6"></div>
                <div className="flex justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="h-5 w-24 bg-slate-200 rounded"></div>
                  <div className="h-5 w-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
