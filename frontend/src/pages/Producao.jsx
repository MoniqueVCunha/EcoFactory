import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import { producaoMensal } from '../data/mockData' // Mantido o gráfico mockado para agregados mensais

// Endereço base da sua API Express rodando na porta 3000
const API_URL = 'http://localhost:3000'

export default function Producao() {
  const [producoes, setProducoes] = useState([])
  const [maquinas, setMaquinas] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ produto: '', quantidadeProduzida: '', quantidadeEsperada: '', maquinaId: '', data: '' })
  const [erros, setErros] = useState({})
  const [filtroMaquina, setFiltroMaquina] = useState('todas')
  const [carregando, setCarregando] = useState(true)

  // 🔄 CARREGAR PRODUÇÕES E MÁQUINAS DO BANCO (GET)
  async function carregarDados() {
    try {
      setCarregando(true)
      const [resProducoes, resMaquinas] = await Promise.all([
        axios.get(`${API_URL}/producoes`),
        axios.get(`${API_URL}/maquinas`)
      ])
      
      setProducoes(resProducoes.data || [])
      setMaquinas(resMaquinas.data || [])
      
      // Define a primeira máquina como padrão se houver máquinas disponíveis
      if (resMaquinas.data && resMaquinas.data.length > 0) {
        setForm(prev => ({ ...prev, maquinaId: prev.maquinaId || resMaquinas.data[0].id }))
      }
    } catch (err) {
      console.error("Erro ao buscar dados do banco:", err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const nomeMaquina = (id) => maquinas.find((m) => Number(m.id) === Number(id))?.nome || '—'

  const produtividade = (produzida, esperada) => {
    if (!esperada || Number(esperada) === 0) return 0
    return ((Number(produzida) / Number(esperada)) * 100).toFixed(0)
  }

  const listaFiltrada = useMemo(() => {
    if (filtroMaquina === 'todas') return producoes
    return producoes.filter((p) => Number(p.maquinaId || p.maquina_id) === Number(filtroMaquina))
  }, [producoes, filtroMaquina])

  function validar() {
    const novosErros = {}
    if (!form.produto.trim()) novosErros.produto = 'Informe o nome do produto.'
    if (!form.quantidadeProduzida || isNaN(form.quantidadeProduzida)) novosErros.quantidadeProduzida = 'Informe um número válido.'
    if (!form.quantidadeEsperada || isNaN(form.quantidadeEsperada) || Number(form.quantidadeEsperada) <= 0) novosErros.quantidadeEsperada = 'Meta deve ser maior que zero.'
    if (!form.data) novosErros.data = 'Selecione a data.'
    if (!form.maquinaId) novosErros.maquinaId = 'Selecione uma máquina válida.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // 💾 SALVAR NOVA PRODUÇÃO NO POSTGRESQL (POST)
  async function salvar(e) {
    e.preventDefault()
    if (!validar()) return
    
    try {
      const dadosParaEnviar = {
        produto: form.produto,
        quantidade_produzida: Number(form.quantidadeProduzida),
        quantidade_esperada: Number(form.quantidadeEsperada),
        maquina_id: Number(form.maquinaId),
        data: form.data
      }

      await axios.post(`${API_URL}/producoes`, dadosParaEnviar)
      
      // Recarrega os dados atualizados direto do banco Neon
      await carregarDados()
      
      // Resetar formulário mantendo a máquina atual selecionada
      setForm({
        produto: '',
        quantidadeProduzida: '',
        quantidadeEsperada: '',
        maquinaId: maquinas[0]?.id || '',
        data: ''
      })
      setModalAberto(false)
    } catch (err) {
      console.error("Erro ao salvar produção:", err)
      alert("Erro ao salvar produção no banco de dados.")
    }
  }

  return (
    <div>
      <Topbar titulo="Produção" subtitulo="Monitoramento e controle de produtividade" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <select
          value={filtroMaquina}
          onChange={(e) => setFiltroMaquina(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
        >
          <option value="todas">Filtrar por Máquina: Todas</option>
          {maquinas.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>

        <button
          onClick={() => setModalAberto(true)}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          disabled={maquinas.length === 0}
        >
          {maquinas.length === 0 ? 'Cadastre uma Máquina Primeiro' : '+ Nova Produção'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-bold text-slate-800 mb-1">Produção vs Meta por Mês</h3>
        <p className="text-xs text-slate-400 mb-4">Jan – Jul 2026</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={producaoMensal}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="producao" fill="#16a34a" name="Produção" radius={[4, 4, 0, 0]} />
            <Bar dataKey="meta" fill="#3b82f6" name="Meta" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="text-center text-slate-500 py-10 text-sm">Carregando dados de produção...</div>
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
              {listaFiltrada.map((p) => {
                const qtdProd = p.quantidade_produzida ?? p.quantidadeProduzida ?? 0
                const qtdEsp = p.quantidade_esperada ?? p.quantidadeEsperada ?? 1
                const mqId = p.maquina_id ?? p.maquinaId
                const nomeMq = p.nome_maquina ?? nomeMaquina(mqId)
                
                const pct = produtividade(qtdProd, qtdEsp)
                const cor = pct >= 100 ? 'text-eco-green' : pct >= 90 ? 'text-orange-500' : 'text-red-500'
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-700">{p.produto}</td>
                    <td className="px-5 py-3 text-slate-600">{Number(qtdProd).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-3 text-slate-400">{Number(qtdEsp).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${pct >= 100 ? 'bg-eco-green' : pct >= 90 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`font-semibold text-xs ${cor}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-blue-600">{nomeMq}</td>
                    <td className="px-5 py-3 text-slate-400">
                      {p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'}
                    </td>
                  </tr>
                )
              })}
              {listaFiltrada.length === 0 && (
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
        <Modal titulo="Nova Produção" onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
              <input
                value={form.produto}
                onChange={(e) => setForm({ ...form, produto: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                placeholder="Ex: Válvula V-200"
              />
              {erros.produto && <p className="text-xs text-red-600 mt-1">{erros.produto}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. produzida</label>
                <input
                  type="number"
                  value={form.quantidadeProduzida}
                  onChange={(e) => setForm({ ...form, quantidadeProduzida: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
                {erros.quantidadeProduzida && <p className="text-xs text-red-600 mt-1">{erros.quantidadeProduzida}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta esperada</label>
                <input
                  type="number"
                  value={form.quantidadeEsperada}
                  onChange={(e) => setForm({ ...form, quantidadeEsperada: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
                {erros.quantidadeEsperada && <p className="text-xs text-red-600 mt-1">{erros.quantidadeEsperada}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Máquina utilizada</label>
              <select
                value={form.maquinaId}
                onChange={(e) => setForm({ ...form, maquinaId: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              >
                {maquinas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
              {erros.maquinaId && <p className="text-xs text-red-600 mt-1">{erros.maquinaId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data da produção</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              />
              {erros.data && <p className="text-xs text-red-600 mt-1">{erros.data}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-eco-green hover:bg-green-700 text-white rounded-lg py-2 text-sm font-semibold"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}