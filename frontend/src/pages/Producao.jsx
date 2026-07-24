import { useState, useEffect } from 'react'
import axios from 'axios'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'

const API_PRODUCAO = 'http://localhost:3000/producao'
const API_MAQUINAS = 'http://localhost:3000/maquinas'

const MOCK_MAQUINAS = [
  { id: 1, nome: 'Torno CNC A1' },
  { id: 2, nome: 'Prensa Hidráulica P2' },
  { id: 3, nome: 'Fresadora F1' }
]

const MOCK_PRODUCAO = [
  { id: 1, produto: 'Eixo de Transmissão', quantidade: 450, meta: 500, maquina_id: 1, maquina_nome: 'Torno CNC A1', data: '2026-07-20' },
  { id: 2, produto: 'Chapa Estampada 5mm', quantidade: 1200, meta: 1000, maquina_id: 2, maquina_nome: 'Prensa Hidráulica P2', data: '2026-07-21' }
]

export default function Producao() {
  const [producoes, setProducoes] = useState([])
  const [maquinas, setMaquinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [filtroMaquina, setFiltroMaquina] = useState('todas')
  
  const [form, setForm] = useState({
    produto: '',
    quantidade: '',
    meta: '',
    maquina_id: '',
    data: new Date().toISOString().split('T')[0]
  })

  async function carregarDados() {
    try {
      setLoading(true)
      const [resProd, resMaq] = await Promise.allSettled([
        axios.get(API_PRODUCAO),
        axios.get(API_MAQUINAS)
      ])

      const listaMaq = resMaq.status === 'fulfilled' && resMaq.value.data?.length > 0
        ? resMaq.value.data 
        : MOCK_MAQUINAS

      const listaProd = resProd.status === 'fulfilled' && resProd.value.data?.length > 0
        ? resProd.value.data 
        : MOCK_PRODUCAO

      setMaquinas(listaMaq)
      setProducoes(listaProd)
      if (listaMaq.length > 0) {
        setForm(prev => ({ ...prev, maquina_id: listaMaq[0].id }))
      }
    } catch {
      setMaquinas(MOCK_MAQUINAS)
      setProducoes(MOCK_PRODUCAO)
      setForm(prev => ({ ...prev, maquina_id: MOCK_MAQUINAS[0].id }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function salvar(e) {
    e.preventDefault()
    if (!form.produto || !form.quantidade || !form.meta || !form.maquina_id) return

    const maquinaSel = maquinas.find(m => String(m.id) === String(form.maquina_id))
    const novoRegistro = {
      produto: form.produto,
      quantidade: Number(form.quantidade),
      meta: Number(form.meta),
      maquina_id: form.maquina_id,
      maquina_nome: maquinaSel ? maquinaSel.nome : 'Máquina General',
      data: form.data
    }

    try {
      await axios.post(API_PRODUCAO, novoRegistro)
      carregarDados()
    } catch {
      setProducoes(prev => [{ id: Date.now(), ...novoRegistro }, ...prev])
    } finally {
      setModalAberto(false)
      setForm({ produto: '', quantidade: '', meta: '', maquina_id: maquinas[0]?.id || '', data: new Date().toISOString().split('T')[0] })
    }
  }

  const producoesFiltradas = filtroMaquina === 'todas'
    ? producoes
    : producoes.filter(p => String(p.maquina_id) === String(filtroMaquina))

  return (
    <div>
      <Topbar titulo="Produção" subtitulo="Monitoramento e controle de produtividade" />

      <div className="flex justify-between items-center mb-6">
        <select
          value={filtroMaquina}
          onChange={(e) => setFiltroMaquina(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="todas">Filtrar por Máquina: Todas</option>
          {maquinas.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>

        <button
          onClick={() => setModalAberto(true)}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          + Registrar Produção
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-slate-500 py-10">Carregando dados de produção... ⏳</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Qtd. Produzida</th>
                <th className="px-5 py-3 font-medium">Meta</th>
                <th className="px-5 py-3 font-medium">Produtividade</th>
                <th className="px-5 py-3 font-medium">Máquina</th>
                <th className="px-5 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {producoesFiltradas.map((p) => {
                const perc = Math.round((p.quantidade / p.meta) * 100) || 0
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-700">{p.produto}</td>
                    <td className="px-5 py-3 text-slate-600">{p.quantidade} un.</td>
                    <td className="px-5 py-3 text-slate-600">{p.meta} un.</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${perc >= 100 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {perc}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{p.maquina_nome || 'N/A'}</td>
                    <td className="px-5 py-3 text-slate-500">{p.data}</td>
                  </tr>
                )
              })}
              {producoesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-10">
                    Nenhum registro de produção encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <Modal titulo="Novo Registro de Produção" onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
              <input
                required
                value={form.produto}
                onChange={(e) => setForm({ ...form, produto: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Ex: Peça C-102"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Máquina Responsável</label>
              <select
                value={form.maquina_id}
                onChange={(e) => setForm({ ...form, maquina_id: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              >
                {maquinas.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Produzida</label>
                <input
                  type="number"
                  required
                  value={form.quantidade}
                  onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta do Turno</label>
                <input
                  type="number"
                  required
                  value={form.meta}
                  onChange={(e) => setForm({ ...form, meta: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
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