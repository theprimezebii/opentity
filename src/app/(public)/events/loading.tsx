export default function LoadingEvents() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="h-10 bg-slate-200 rounded-lg w-64 mb-4"></div>
        <div className="h-5 bg-slate-200 rounded-lg w-96 max-w-full"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden h-[350px] flex flex-col">
            {/* Image Skeleton */}
            <div className="h-44 bg-slate-200 w-full"></div>
            <div className="p-5 flex flex-col flex-grow">
              {/* Tags Skeleton */}
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-slate-200 rounded-md w-16"></div>
                <div className="h-5 bg-slate-200 rounded-md w-20"></div>
              </div>
              {/* Title Skeleton */}
              <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3"></div>
              {/* Description Skeleton */}
              <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded-md w-5/6 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded-md w-4/6 mb-4"></div>
              
              {/* Footer Skeleton */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-200 rounded-md w-24"></div>
                <div className="h-4 bg-slate-200 rounded-md w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
