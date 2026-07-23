import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import { consumoAguaMensal, consumoEnergiaMensal } from '../data/mockData'

// Endereço correto apontando para o servidor Express rodando na porta 3000
const API_URL = 'http://localhost:3000/sustentabilidade'

const dadosPadrao = {
  consumoAgua: 0,
  consumoEnergia: 0,
  residuos: 0,
  quantidadeReciclada: 0
}

export default function Sustentabilidade() {
  const [dados, setDados] = useState(dadosPadrao)
  const [loading, setLoading] = useState(true)

  // 🔄 CARREGAR INDICADORES AMBIENTAIS DO BANCO DE DADOS (GET)
  useEffect(() => {
    async function carregarIndicadores() {
      try {
        setLoading(true)
        const response = await axios.get(API_URL)
        
        if (response.data && response.data.length > 0) {
          // Soma os totais de todos os registros presentes na tabela do banco
          const totais = response.data.reduce(
            (acc, curr) => {
              const res = Number(curr.quantidade_residuos || curr.residuos || 0)
              const rec = Number(curr.quantidade_reciclada || curr.quantidadeReciclada || 0)
              const agua = Number(curr.consumo_agua || curr.consumoAgua || 0)
              
              return {
                residuos: acc.residuos + res,
                quantidadeReciclada: acc.quantidadeReciclada + rec,
                consumoAgua: acc.consumoAgua + agua,
              }
            },
            { residuos: 0, quantidadeReciclada: 0, consumoAgua: 0 }
          )

          setDados({
            ...totais,
            consumoEnergia: 420 // Estimativa/Mock para energia se não estipulado por registro
          })
        }
      } catch (err) {
        console.error('Erro ao buscar indicadores de sustentabilidade:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarIndicadores()
  }, [])

  // Cálculo seguro do percentual de reciclagem (evita divisão por zero)
  const percentualReciclado = dados.residuos > 0 
    ? Math.round((dados.quantidadeReciclada / dados.residuos) * 100)
    : 0

  const destinacao = [
    { label: 'Reciclagem', valor: percentualReciclado, cor: 'bg-eco-green' },
    { label: 'Reaproveitamento interno', valor: 6, cor: 'bg-blue-500' },
    { label: 'Aterro controlado', valor: 5, cor: 'bg-orange-400' },
    { label: 'Descarte especial', valor: 2, cor: 'bg-red-500' },
  ]

  return (
    <div>
      <Topbar titulo="Sustentabilidade" subtitulo="Indicadores ambientais e de eficiência energética" />

      {loading ? (
        <div className="text-center text-slate-500 py-12 text-sm">Carregando indicadores ecológicos... 🌿</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
            <StatCard icon="💧" label="Consumo de Água" value={`${dados.consumoAgua} m³`} hint="Total acumulado" />
            <StatCard icon="⚡" label="Consumo de Energia" value={`${dados.consumoEnergia} MWh`} hint="-6% vs mês anterior" />
            <StatCard icon="📦" label="Resíduos Gerados" value={`${dados.residuos} kg`} hint="Total acumulado" hintPositive={false} />
            <StatCard icon="♻️" label="% Reciclado" value={`${percentualReciclado}%`} hint="Taxa de reaproveitamento" />
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
        </>
      )}
    </div>
  )
}