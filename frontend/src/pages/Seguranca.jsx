import { useState, useEffect } from 'react'
import axios from 'axios'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'

const API_SEGURANCA = 'http://localhost:3000/seguranca'

const MOCK_OCORRENCIAS = [
  { id: 1, tipo: 'Vazamento de Óleo', local: 'Setor Usinagem - Torno A1', risco: 'Médio', data: '2026-07-18', descricao: 'Pequeno vazamento identificado no reservatório inferior.' },
  { id: 2, tipo: 'Falta de EPI', local: 'Montagem', risco: 'Baixo', data: '2026-07-22', descricao: 'Operador sem óculos de proteção na área delimitada.' }
]

export default function Seguranca() {
  const [ocorrencias, setOcorrencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ tipo: '', local: '', data: '', risco: 'Baixo', descricao: '' })

  async function carregarOcorrencias() {
    try {
      setLoading(true)
      const res = await axios.get(API_SEGURANCA)
      setOcorrencias(res.data?.length > 0 ? res.data : MOCK_OCORRENCIAS)
    } catch {
      setOcorrencias(MOCK_OCORRENCIAS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarOcorrencias()
  }, [])

  async function salvar(e) {
    e.preventDefault()
    
    const novaOcorrencia = { ...form }

    try {
      await axios.post(API_SEGURANCA, novaOcorrencia)
      carregarOcorrencias()
    } catch {
      console.warn('Backend sem resposta. Salvando ocorrência localmente.')
      setOcorrencias(prev => [{ id: Date.now(), ...novaOcorrencia }, ...prev])
    } finally {
      setModalAberto(false)
      setForm({ tipo: '', local: '', data: '', risco: 'Baixo', descricao: '' })
    }
  }

  const criticos = ocorrencias.filter(o => o.risco === 'Crítico').length
  const altos = ocorrencias.filter(o => o.risco === 'Alto').length

  return (
    <div>
      <Topbar titulo="Segurança" subtitulo="Registro de ocorrências e ações preventivas" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Ocorrências Registradas</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{ocorrencias.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Risco Crítico</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">{criticos}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Risco Alto</p>
          <h3 className="text-2xl font-bold text-orange-500 mt-1">{altos}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total Ativo</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{ocorrencias.length}</h3>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalAberto(true)}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          + Nova Ocorrência
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-slate-500 py-10">Carregando dados de segurança... ⏳</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Tipo / Detalhes</th>
                <th className="px-5 py-3 font-medium">Local</th>
                <th className="px-5 py-3 font-medium">Risco</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {ocorrencias.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-700">{o.tipo}</td>
                  <td className="px-5 py-3 text-slate-500">{o.local}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      o.risco === 'Crítico' ? 'bg-red-100 text-red-700' :
                      o.risco === 'Alto' ? 'bg-orange-100 text-orange-700' :
                      o.risco === 'Médio' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {o.risco}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{o.data}</td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{o.descricao}</td>
                </tr>
              ))}
              {ocorrencias.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 py-10">
                    Nenhuma ocorrência registrada. Tudo seguro por aqui!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <Modal titulo="Nova Ocorrência" onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo da ocorrência</label>
              <input
                required
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Ex: Vazamento, Falha em EPI..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                <input
                  required
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                  placeholder="Ex: Setor A"
                />
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
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nível de risco</label>
              <select
                value={form.risco}
                onChange={(e) => setForm({ ...form, risco: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Baixo">Baixo</option>
                <option value="Médio">Médio</option>
                <option value="Alto">Alto</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <textarea
                required
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                rows={3}
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