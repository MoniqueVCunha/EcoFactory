import { useState, useEffect } from 'react'
import axios from 'axios'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { niveisRisco } from '../data/mockData'

const API_URL = 'http://localhost:3001/ocorrencias'

const vazio = { tipo: '', local: '', data: '', risco: niveisRisco[0], descricao: '', medidaPreventiva: '' }

export default function Seguranca() {
  const [ocorrencias, setOcorrencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(vazio)
  const [erros, setErros] = useState({})

  // 🔄 BUSCAR OCORRÊNCIAS DO BANCO DE DADOS (GET)
  async function carregarOcorrencias() {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      // Normaliza as propriedades vindas do Postgres (snake_case) para o formato do seu front (camelCase)
      const dadosTratados = response.data.map(o => ({
        id: o.id,
        tipo: o.tipo,
        local: o.local,
        data: o.data,
        risco: o.nivel_risco || o.risco, // Aceita as duas chaves por segurança
        descricao: o.descricao,
        medidaPreventiva: o.medida_preventiva || o.medidaPreventiva
      }))
      setOcorrencias(dadosTratados)
    } catch (err) {
      console.error('Erro ao buscar ocorrências:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarOcorrencias()
  }, [])

  // 📊 Cálculo dinâmico dos cards de estatísticas usando os dados REAIS do Neon
  const criticas = ocorrencias.filter((o) => o.risco === 'Crítico').length
  const altas = ocorrencias.filter((o) => o.risco === 'Alto').length

  function validar() {
    const novosErros = {}
    if (!form.tipo.trim()) novosErros.tipo = 'Informe o tipo da ocorrência.'
    if (!form.local.trim()) novosErros.local = 'Informe o local.'
    if (!form.data) novosErros.data = 'Selecione a data.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // 💾 SALVAR NOVA OCORRÊNCIA NO BANCO DE DADOS (POST)
  async function salvar(e) {
    e.preventDefault()
    if (!validar()) return

    // Prepara o payload convertendo camelCase para o padrão snake_case do PostgreSQL do Neon
    const dadosParaEnviar = {
      tipo: form.tipo,
      local: form.local,
      data: form.data,
      nivel_risco: form.risco,
      descricao: form.descricao,
      medida_preventiva: form.medidaPreventiva
    }

    try {
      await axios.post(API_URL, dadosParaEnviar)
      setModalAberto(false)
      setForm(vazio)
      carregarOcorrencias() // Recarrega os dados atualizados direto da nuvem!
    } catch (err) {
      console.error('Erro ao salvar ocorrência:', err)
      alert('Erro ao registrar ocorrência no banco de dados.')
    }
  }

  return (
    <div>
      <Topbar titulo="Segurança" subtitulo="Registro de ocorrências e ações preventivas" />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalAberto(true)}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          + Nova Ocorrência
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon="📋" label="Ocorrências este mês" value={ocorrencias.length} />
        <StatCard icon="🔴" label="Risco Crítico" value={criticas} hintPositive={false} />
        <StatCard icon="🟠" label="Risco Alto" value={altas} hintPositive={false} />
        <StatCard icon="✅" label="Resolvidas" value={ocorrencias.length > 0 ? ocorrencias.length : 0} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-slate-500 py-10 text-sm">Carregando dados de SST da nuvem... ⏳</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Tipo da Ocorrência</th>
                <th className="px-5 py-3 font-medium">Local</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Risco</th>
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 font-medium">Medida Preventiva</th>
              </tr>
            </thead>
            <tbody>
              {ocorrencias.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-700">{o.tipo}</td>
                  <td className="px-5 py-3 text-slate-500">{o.local}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(o.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-5 py-3"><Badge valor={o.risco} /></td>
                  <td className="px-5 py-3 text-slate-500 max-w-xs truncate" title={o.descricao}>{o.descricao || '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{o.medidaPreventiva || '—'}</td>
                </tr>
              ))}
              {ocorrencias.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-10">
                    Nenhuma ocorrência registrada no banco. Tudo seguro por aqui!
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
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                placeholder="Ex: Vazamento de óleo"
              />
              {erros.tipo && <p className="text-xs text-red-600 mt-1">{erros.tipo}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                <input
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                  placeholder="Ex: Setor Fundição"
                />
                {erros.local && <p className="text-xs text-red-600 mt-1">{erros.local}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
                {erros.data && <p className="text-xs text-red-600 mt-1">{erros.data}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nível de risco</label>
              <select
                value={form.risco}
                onChange={(e) => setForm({ ...form, risco: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              >
                {niveisRisco.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medida preventiva</label>
              <input
                value={form.medidaPreventiva}
                onChange={(e) => setForm({ ...form, medidaPreventiva: e.target.value })}
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