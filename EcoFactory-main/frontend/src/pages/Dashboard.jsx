import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import { maquinasIniciais, producaoMensal, producoesIniciais, sustentabilidadeIniciais } from '../data/mockData'

export default function Dashboard() {
  const totalMaquinas = maquinasIniciais.length
  const emOperacao = maquinasIniciais.filter((m) => m.status === 'Operando').length
  const emManutencao = maquinasIniciais.filter((m) => m.status === 'Manutenção').length
  const paradas = maquinasIniciais.filter((m) => m.status === 'Parada').length
  const desativadas = maquinasIniciais.filter((m) => m.status === 'Desativada').length

  const producaoDoDia = producoesIniciais
    .filter((p) => p.data === '2026-07-15')
    .reduce((soma, p) => soma + p.quantidadeProduzida, 0)

  const consumoEnergiaHoje = sustentabilidadeIniciais[0].consumoEnergia
  const percentualReciclado = (
    (sustentabilidadeIniciais[0].quantidadeReciclada / sustentabilidadeIniciais[0].residuos) *
    100
  ).toFixed(0)

  const statusData = [
    { name: 'Em Operação', value: emOperacao, color: '#22c55e' },
    { name: 'Em Manutenção', value: emManutencao, color: '#f97316' },
    { name: 'Paradas', value: paradas, color: '#ef4444' },
    { name: 'Desativadas', value: desativadas, color: '#94a3b8' },
  ]

  return (
    <div>
      <Topbar titulo="Dashboard" subtitulo="Visão geral da planta industrial — 15 de julho de 2026" />

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon="⚙️" label="Máquinas Cadastradas" value={totalMaquinas} hint="+3 este mês" />
        <StatCard icon="📈" label="Em Operação" value={emOperacao} hint={`${Math.round((emOperacao / totalMaquinas) * 100)}% da frota ativa`} />
        <StatCard icon="📦" label="Produção do Dia" value={producaoDoDia.toLocaleString('pt-BR')} hint="+12% vs meta" />
        <StatCard icon="⚡" label="Consumo de Energia" value={`${consumoEnergiaHoje} kWh`} hint="-4% vs ontem" hintPositive={false} />
        <StatCard icon="♻️" label="Resíduos Reciclados" value={`${percentualReciclado}%`} hint="+2% vs semana" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-1">Evolução da Produção</h3>
          <p className="text-xs text-slate-400 mb-4">Jan – Jul 2026</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={producaoMensal}>
              <defs>
                <linearGradient id="corProducao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="producao" stroke="#16a34a" fill="url(#corProducao)" strokeWidth={2} name="Produção" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-1">Status das Máquinas</h3>
          <p className="text-xs text-slate-400 mb-4">{totalMaquinas} equipamentos</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold text-slate-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
