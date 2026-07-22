import { useState, useEffect } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'

const API_URL = 'http://localhost:3001'


const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function Dashboard() {
  const [maquinas, setMaquinas] = useState([])
  const [producoes, setProducoes] = useState([])
  const [sustentabilidade, setSustentabilidade] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resMaq, resProd, resSust] = await Promise.all([
          axios.get(`${API_URL}/maquinas`),
          axios.get(`${API_URL}/producoes`),
          axios.get(`${API_URL}/sustentabilidade`),
        ])
        setMaquinas(resMaq.data)
        setProducoes(resProd.data)
        setSustentabilidade(resSust.data)
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  // --- Cálculos de máquinas ---
  const totalMaquinas = maquinas.length
  const emOperacao = maquinas.filter((m) => m.status === 'Em operação').length
  const emManutencao = maquinas.filter((m) => m.status === 'Em manutenção').length
  const paradas = maquinas.filter((m) => m.status === 'Parada').length
  const desativadas = maquinas.filter((m) => m.status === 'Desativada').length

  // --- Cálculos de produção ---
  const producaoTotal = producoes.reduce((soma, p) => soma + (p.quantidade_produzida || p.quantidadeProduzida || 0), 0)

  // Agrupa produções por mês para o gráfico
  const producaoPorMes = producoes.reduce((acc, p) => {
    const data = p.data ? new Date(p.data) : null
    if (!data) return acc
    const mes = MESES[data.getMonth()]
    acc[mes] = (acc[mes] || 0) + (p.quantidade_produzida || p.quantidadeProduzida || 0)
    return acc
  }, {})
  const producaoMensal = MESES.filter((m) => producaoPorMes[m]).map((mes) => ({
    mes,
    producao: producaoPorMes[mes],
  }))

  // --- Cálculos de sustentabilidade ---
  const ultimoRegistro = sustentabilidade[0] || {}
  const consumoEnergia = ultimoRegistro.consumo_energia || ultimoRegistro.consumoEnergia || 0
  const residuos = ultimoRegistro.residuos || 0
  const reciclada = ultimoRegistro.quantidade_reciclada || ultimoRegistro.quantidadeReciclada || 0
  const percentualReciclado = residuos > 0 ? ((reciclada / residuos) * 100).toFixed(0) : 0

  const statusData = [
    { name: 'Em Operação', value: emOperacao, color: '#22c55e' },
    { name: 'Em Manutenção', value: emManutencao, color: '#f97316' },
    { name: 'Paradas', value: paradas, color: '#ef4444' },
    { name: 'Desativadas', value: desativadas, color: '#94a3b8' },
  ]

  if (loading) {
    return (
      <div>
        <Topbar titulo="Dashboard" subtitulo="Carregando dados da planta industrial..." />
        <p className="text-slate-500 mt-8 text-center">Buscando dados do banco de dados...</p>
      </div>
    )
  }

  return (
    <div>
      <Topbar titulo="Dashboard" subtitulo="Visão geral da planta industrial — dados em tempo real" />

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon="⚙️" label="Máquinas Cadastradas" value={totalMaquinas} hint="total no sistema" />
        <StatCard icon="📈" label="Em Operação" value={emOperacao} hint={totalMaquinas > 0 ? `${Math.round((emOperacao / totalMaquinas) * 100)}% da frota ativa` : '-'} />
        <StatCard icon="📦" label="Produção Total" value={producaoTotal.toLocaleString('pt-BR')} hint="unidades registradas" />
        <StatCard icon="⚡" label="Consumo de Energia" value={`${consumoEnergia} kWh`} hint="último registro" hintPositive={false} />
        <StatCard icon="♻️" label="Resíduos Reciclados" value={`${percentualReciclado}%`} hint="último registro" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-1">Evolução da Produção</h3>
          <p className="text-xs text-slate-400 mb-4">Produção por mês — dados reais do banco</p>
          {producaoMensal.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-16">Nenhum dado de produção registrado ainda.</p>
          ) : (
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
          )}
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