import { useState } from 'react'
import Topbar from '../components/Topbar'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { maquinasIniciais, setores, tiposMaquina, statusMaquina } from '../data/mockData'

const vazio = { nome: '', setor: setores[0], tipo: tiposMaquina[0], status: statusMaquina[0], temperatura: '', energia: '' }

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState(maquinasIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(vazio)
  const [erros, setErros] = useState({})
  const [excluirId, setExcluirId] = useState(null)

  function abrirNovo() {
    setForm(vazio)
    setEditandoId(null)
    setErros({})
    setModalAberto(true)
  }

  function abrirEdicao(maquina) {
    setForm({ ...maquina })
    setEditandoId(maquina.id)
    setErros({})
    setModalAberto(true)
  }

  function validar() {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Informe o nome da máquina.'
    if (form.temperatura === '' || isNaN(form.temperatura)) novosErros.temperatura = 'Informe uma temperatura válida.'
    if (form.energia === '' || isNaN(form.energia)) novosErros.energia = 'Informe um consumo de energia válido.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function salvar(e) {
    e.preventDefault()
    if (!validar()) return

    if (editandoId) {
      setMaquinas((prev) => prev.map((m) => (m.id === editandoId ? { ...form, id: editandoId, temperatura: Number(form.temperatura), energia: Number(form.energia) } : m)))
    } else {
      const novoId = Math.max(0, ...maquinas.map((m) => m.id)) + 1
      setMaquinas((prev) => [...prev, { ...form, id: novoId, temperatura: Number(form.temperatura), energia: Number(form.energia) }])
    }
    setModalAberto(false)
  }

  function confirmarExclusao() {
    setMaquinas((prev) => prev.filter((m) => m.id !== excluirId))
    setExcluirId(null)
  }

  return (
    <div>
      <Topbar titulo="Máquinas" subtitulo="Gerenciamento da frota de equipamentos" />

      <div className="flex justify-end mb-4">
        <button
          onClick={abrirNovo}
          className="bg-eco-green hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
        >
          + Nova Máquina
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">Setor</th>
              <th className="px-5 py-3 font-medium">Tipo</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Temperatura</th>
              <th className="px-5 py-3 font-medium">Energia (kWh)</th>
              <th className="px-5 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-3 font-medium text-slate-700">{m.nome}</td>
                <td className="px-5 py-3 text-slate-500">{m.setor}</td>
                <td className="px-5 py-3 text-slate-500">{m.tipo}</td>
                <td className="px-5 py-3"><Badge valor={m.status} /></td>
                <td className={`px-5 py-3 ${m.temperatura > 70 ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>{m.temperatura}°C</td>
                <td className="px-5 py-3 text-slate-600">{m.energia} kWh</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button onClick={() => abrirEdicao(m)} className="text-slate-400 hover:text-eco-green">✏️</button>
                  <button onClick={() => setExcluirId(m.id)} className="text-slate-400 hover:text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
            {maquinas.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-10">
                  Nenhuma máquina cadastrada. Clique em "Nova Máquina" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <Modal titulo={editandoId ? 'Editar Máquina' : 'Nova Máquina'} onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da máquina</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-green/40"
                placeholder="Ex: Torno CNC T-01"
              />
              {erros.nome && <p className="text-xs text-red-600 mt-1">{erros.nome}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
                <select
                  value={form.setor}
                  onChange={(e) => setForm({ ...form, setor: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                >
                  {setores.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                >
                  {tiposMaquina.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
              >
                {statusMaquina.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temperatura (°C)</label>
                <input
                  type="number"
                  value={form.temperatura}
                  onChange={(e) => setForm({ ...form, temperatura: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
                {erros.temperatura && <p className="text-xs text-red-600 mt-1">{erros.temperatura}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Energia (kWh)</label>
                <input
                  type="number"
                  value={form.energia}
                  onChange={(e) => setForm({ ...form, energia: e.target.value })}
                  className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm"
                />
                {erros.energia && <p className="text-xs text-red-600 mt-1">{erros.energia}</p>}
              </div>
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

      {excluirId && (
        <Modal titulo="Excluir máquina" onFechar={() => setExcluirId(null)}>
          <p className="text-sm text-slate-600 mb-5">
            Tem certeza que deseja excluir esta máquina? Essa ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setExcluirId(null)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600">
              Cancelar
            </button>
            <button onClick={confirmarExclusao} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-semibold">
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
