export function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-row sm:flex-col h-[180px] sm:h-[380px] animate-pulse"
        >
          {/* Image Skeleton: Left on mobile, top on desktop */}
          <div className="w-32 sm:w-full shrink-0 bg-slate-200 dark:bg-slate-700" />
          
          {/* Content Skeleton */}
          <div className="p-3 sm:p-5 flex flex-col flex-grow min-w-0">
            {/* Badges */}
            <div className="flex gap-1.5 mb-2">
              <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block" />
            </div>
            
            {/* Title (2 lines) */}
            <div className="mb-1 space-y-1">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            
            {/* Description */}
            <div className="mt-2 space-y-1 flex-grow">
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded" />
              <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-700/50 rounded hidden sm:block" />
            </div>
            
            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
