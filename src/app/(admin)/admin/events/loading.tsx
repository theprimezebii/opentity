export default function LoadingAdminEvents() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-14 bg-slate-50 border-b border-slate-200"></div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-md w-64"></div>
                <div className="h-4 bg-slate-200 rounded-md w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-200 rounded-md w-24"></div>
                <div className="h-8 bg-slate-200 rounded-md w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
