import { useState, useEffect } from 'react'
import axios from 'axios'
import Topbar from '../components/Topbar'

const API_SUSTENTABILIDADE = 'http://localhost:3000/sustentabilidade'

const MOCK_SUSTENTABILIDADE = {
  aguaTotal: 2150,
  energiaTotal: 840,
  residuosTotal: 1250,
  taxaReciclagem: 78
}

export default function Sustentabilidade() {
  const [dados, setDados] = useState(MOCK_SUSTENTABILIDADE)

  useEffect(() => {
    async function carregar() {
      try {
        const response = await axios.get(API_SUSTENTABILIDADE)
        if (response.data && response.data.aguaTotal) {
          setDados(response.data)
        }
      } catch {
        console.warn('Backend indisponível para sustentabilidade. Exibindo métricas locais.')
      }
    }
    carregar()
  }, [])

  return (
    <div>
      <Topbar titulo="Sustentabilidade" subtitulo="Indicadores ambientais e de eficiência energética" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Consumo de Água</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{dados.aguaTotal} m³</h3>
          <span className="text-xs text-green-600 font-medium">↗ Total acumulado</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Consumo de Energia</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{dados.energiaTotal} MWh</h3>
          <span className="text-xs text-green-600 font-medium">↘ -6% vs mês anterior</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Resíduos Gerados</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{dados.residuosTotal} kg</h3>
          <span className="text-xs text-slate-400 font-medium">Total acumulado</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">% Reciclado</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{dados.taxaReciclagem}%</h3>
          <span className="text-xs text-green-600 font-medium">↗ Taxa de reaproveitamento</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Destinação de Resíduos</h4>
        <div className="space-y-4 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600">Reciclagem</span>
              <span className="font-semibold text-slate-700">78%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600">Reaproveitamento interno</span>
              <span className="font-semibold text-slate-700">14%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '14%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600">Aterro controlado</span>
              <span className="font-semibold text-slate-700">5%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full" style={{ width: '5%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600">Descarte especial</span>
              <span className="font-semibold text-slate-700">3%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: '3%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}