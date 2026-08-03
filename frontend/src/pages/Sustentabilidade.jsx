import { useState, useEffect } from 'react'
import axios from 'axios'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'

const API_SUSTENTABILIDADE = 'http://localhost:3000/sustentabilidade'

const MOCK_REGISTROS = [
  { id: 1, agua: 2150, energia: 840, residuos: 1250, taxa_reciclagem: 78, data: '2026-07-20' }
]

export default function Sustentabilidade() {
  const [registros, setRegistros] = useState(MOCK_REGISTROS)
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  const [form, setForm] = useState({
    agua: '',
    energia: '',
    residuos: '',
    taxa_reciclagem: '78',
    data: new Date().toISOString().split('T')[0]
  })

  async function carregarDados() {
    try {
      setLoading(true)
      const response = await axios.get(API_SUSTENTABILIDADE)
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRegistros(response.data)
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        setRegistros([{
          id: 1,
          agua: response.data.aguaTotal || response.data.agua || 0,
          energia: response.data.energiaTotal || response.data.energia || 0,
          residuos: response.data.residuosTotal || response.data.residuos || response.data.residuo || 0,
          taxa_reciclagem: response.data.taxaReciclagem || response.data.taxa_reciclagem || 78,
          data: response.data.data || new Date().toISOString().split('T')[0]
        }])
      }
    } catch {
      console.warn('Backend indisponível para sustentabilidade. Exibindo métricas locais.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function salvar(e) {
    e.preventDefault()
    if (!form.agua || !form.energia || !form.residuos) return

    const novoRegistro = {
      agua: Number(form.agua),
      energia: Number(form.energia),
      residuos: Number(form.residuos),
      residuo: Number(form.residuos), // compatibilidade com backend
      taxa_reciclagem: Number(form.taxa_reciclagem),
      data: form.data
    }

    try {
      await axios.post(API_SUSTENTABILIDADE, novoRegistro)
      carregarDados()
    } catch {
      setRegistros(prev => [{ id: Date.now(), ...novoRegistro }, ...prev])
    } finally {
      setModalAberto(false)
      setForm({
        agua: '',
        energia: '',
        residuos: '',
        taxa_reciclagem: '78',
        data: new Date().toISOString().split('T')[0]
      })
    }
  }

  // Cálculos agregados para as métricas do topo
  const aguaTotal = registros.reduce((acc, curr) => acc + (Number(curr.agua) || 0), 0)
  const energiaTotal = registros.reduce((acc, curr) => acc + (Number(curr.energia) || 0), 0)
  const residuosTotal = registros.reduce((acc, curr) => acc + (Number(curr.residuos || curr.residuo) || 0), 0)
  const taxaReciclagem = registros[0]?.taxa_reciclagem || registros[0]?.taxaReciclagem || 78

  return (
    <div>
      <Topbar titulo="Sustentabilidade" subtitulo="Indicadores ambientais e de eficiência energética" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Resumo de Indicadores</h3>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          + Registrar Indicadores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Consumo de Água</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{aguaTotal} m³</h3>
          <span className="text-xs text-green-600 font-medium">↗ Total acumulado</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Consumo de Energia</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{energiaTotal} MWh</h3>
          <span className="text-xs text-green-600 font-medium">↘ Total acumulado</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Resíduos Gerados</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{residuosTotal} kg</h3>
          <span className="text-xs text-slate-400 font-medium">Total acumulado</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">% Reciclado</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{taxaReciclagem}%</h3>
          <span className="text-xs text-green-600 font-medium">↗ Taxa de reaproveitamento</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Destinação de Resíduos</h4>
        <div className="space-y-4 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600">Reciclagem</span>
              <span className="font-semibold text-slate-700">{taxaReciclagem}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${taxaReciclagem}%` }}></div>
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

      {modalAberto && (
        <Modal titulo="Novo Registro de Sustentabilidade" onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consumo de Água (m³)</label>
              <input
                type="number"
                required
                value={form.agua}
                onChange={(e) => setForm({ ...form, agua: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Ex: 250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consumo de Energia (MWh)</label>
              <input
                type="number"
                required
                value={form.energia}
                onChange={(e) => setForm({ ...form, energia: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Ex: 120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resíduos Gerados (kg)</label>
              <input
                type="number"
                required
                value={form.residuos}
                onChange={(e) => setForm({ ...form, residuos: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Ex: 450"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalAberto(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600">
                Cancelar
              </button>
              <button type="submit" className="flex-1 bg-eco-green hover:bg-green-700 text-white rounded-lg py-2 text-sm font-semibold">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}