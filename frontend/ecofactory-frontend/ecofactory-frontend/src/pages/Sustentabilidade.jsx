import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import { sustentabilidadeIniciais, consumoAguaMensal, consumoEnergiaMensal } from '../data/mockData'

export default function Sustentabilidade() {
  const dados = sustentabilidadeIniciais[0]
  const percentualReciclado = ((dados.quantidadeReciclada / dados.residuos) * 100).toFixed(0)

  const destinacao = [
    { label: 'Reciclagem', valor: 87, cor: 'bg-eco-green' },
    { label: 'Reaproveitamento interno', valor: 6, cor: 'bg-blue-500' },
    { label: 'Aterro controlado', valor: 5, cor: 'bg-orange-400' },
    { label: 'Descarte especial', valor: 2, cor: 'bg-red-500' },
  ]

  return (
    <div>
      <Topbar titulo="Sustentabilidade" subtitulo="Indicadores ambientais e de eficiência energética" />

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon="💧" label="Consumo de Água" value={`${dados.consumoAgua} m³`} hint="-8% vs mês anterior" />
        <StatCard icon="⚡" label="Consumo de Energia" value={`${dados.consumoEnergia} MWh`} hint="-6% vs mês anterior" />
        <StatCard icon="📦" label="Resíduos Gerados" value={`${dados.residuos} t`} hint="+1% vs mês anterior" hintPositive={false} />
        <StatCard icon="♻️" label="% Reciclado" value={`${percentualReciclado}%`} hint="+4% vs mês anterior" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Consumo de Água (m³)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={consumoAguaMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Consumo de Energia (MWh)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={consumoEnergiaMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-4">Destinação de Resíduos</h3>
        <div className="space-y-3">
          {destinacao.map((d) => (
            <div key={d.label} className="flex items-center gap-3 text-sm">
              <span className="w-44 text-slate-500">{d.label}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${d.cor}`} style={{ width: `${d.valor}%` }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700">{d.valor}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
