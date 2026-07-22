export default function StatCard({ icon, label, value, hint, hintPositive = true }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[160px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-eco-green">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {hint && (
        <p className={`text-xs mt-1 ${hintPositive ? 'text-eco-green' : 'text-red-500'}`}>
          {hintPositive ? '↗' : '↘'} {hint}
        </p>
      )}
    </div>
  )
}
