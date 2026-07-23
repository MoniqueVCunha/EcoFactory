import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/maquinas', label: 'Máquinas', icon: '⚙️' },
  { to: '/producao', label: 'Produção', icon: '📦' },
  { to: '/sustentabilidade', label: 'Sustentabilidade', icon: '♻️' },
  { to: '/seguranca', label: 'Segurança', icon: '🛡️' },
]

export default function Sidebar({ usuario, onSair }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-eco-green flex items-center justify-center text-white font-bold">
          E
        </div>
        <div>
          <p className="font-bold text-slate-800 leading-tight">EcoFactory</p>
          <p className="text-[10px] tracking-wide text-slate-400 font-medium">PLATAFORMA INDUSTRIAL</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-eco-green text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-eco-light/20 text-eco-green flex items-center justify-center text-xs font-bold">
            {usuario.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">{usuario.nome}</p>
            <p className="text-xs text-slate-400">{usuario.cargo}</p>
          </div>
        </div>
        <button
          onClick={onSair}
          className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          ↩ Sair
        </button>
      </div>
    </aside>
  )
}
