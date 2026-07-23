import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Busca os dados reais da rota que criamos no server.js
  useEffect(() => {
    fetch('http://localhost:3000/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados do servidor')
        return res.json()
      })
      .then((data) => {
        setDados(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Não foi possível carregar os dados do Dashboard. Verifique se o servidor está rodando.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="animate-pulse font-semibold">Carregando dados em tempo real...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-200 m-4">
        <p className="font-bold">⚠️ Erro de Conexão</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  // Dados reais para o gráfico de pizza de máquinas
  const statusData = [
    { name: 'Em Operação', value: dados.maquinasEmOperacao || 0, color: '#22c55e' },
    { name: 'Em Manutenção', value: dados.maquinasEmManutencao || 0, color: '#f97316' },
    { 
      name: 'Outros / Paradas', 
      value: (dados.totalMaquinas || 0) - (dados.maquinasEmOperacao + dados.maquinasEmManutencao), 
      color: '#94a3b8' 
    },
  ]

  // Mock temporário apenas para o histórico do gráfico de área (opcional)
  const graficoEvolucao = [
    { mes: 'Jan', producao: Math.round((dados.producaoTotal || 100) * 0.7) },
    { mes: 'Fev', producao: Math.round((dados.producaoTotal || 100) * 0.8) },
    { mes: 'Mar', producao: Math.round((dados.producaoTotal || 100) * 0.85) },
    { mes: 'Abr', producao: Math.round((dados.producaoTotal || 100) * 0.9) },
    { mes: 'Mai', producao: Math.round((dados.producaoTotal || 100) * 0.95) },
    { mes: 'Jun', producao: dados.producaoTotal || 0 },
  ]

  return (
    <div>
      <Topbar titulo="Dashboard" subtitulo="Visão geral da planta industrial — Dados do PostgreSQL Neon" />

      {/* Cards de Métricas Reais */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard 
          icon="⚙️" 
          label="Máquinas Cadastradas" 
          value={dados.totalMaquinas} 
          hint={`${dados.maquinasEmOperacao} em operação`} 
        />
        <StatCard 
          icon="📈" 
          label="Produtividade Média" 
          value={`${dados.produtividadeMedia}%`} 
          hint="Meta vs Produzido" 
        />
        <StatCard 
          icon="📦" 
          label="Produção Total" 
          value={dados.producaoTotal.toLocaleString('pt-BR')} 
          hint="Unidades registradas" 
        />
        <StatCard 
          icon="♻️" 
          label="Resíduos Reciclados" 
          value={`${dados.percentualReciclado}%`} 
          hint="Taxa de reciclagem" 
        />
        <StatCard 
          icon="⚠️" 
          label="Ocorrências Abertas" 
          value={dados.ocorrenciasAbertas} 
          hint="Aguardando resolução" 
          hintPositive={dados.ocorrenciasAbertas === 0}
        />
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-1">Evolução da Produção</h3>
          <p className="text-xs text-slate-400 mb-4">Histórico estimado com base nos dados do banco</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={graficoEvolucao}>
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
          <p className="text-xs text-slate-400 mb-4">{dados.totalMaquinas} equipamentos no total</p>
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