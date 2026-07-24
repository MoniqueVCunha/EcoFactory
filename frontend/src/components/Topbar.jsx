export default function Topbar({ titulo, subtitulo }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{titulo}</h1>
        {subtitulo && <p className="text-sm text-slate-500 mt-0.5">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-slate-100 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-600 w-56 focus:outline-none focus:ring-2 focus:ring-eco-green/40"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
          🔔
        </button>
      </div>
    </div>
  )
}
