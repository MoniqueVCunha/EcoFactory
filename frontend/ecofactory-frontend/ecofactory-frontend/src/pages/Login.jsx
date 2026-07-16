import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onEntrar }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.')
      return
    }
    setErro('')
    onEntrar()
    navigate('/')
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Lado esquerdo - identidade visual */}
      <div className="bg-eco-dark text-white p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-9 h-9 rounded-lg bg-eco-green flex items-center justify-center font-bold">E</div>
          <span className="font-bold text-lg">EcoFactory</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-4">
          Plataforma de Monitoramento<br />
          <span className="text-eco-light">Industrial Inteligente</span>
        </h1>
        <p className="text-slate-300 mb-10 max-w-sm">
          Gerencie sua fábrica com eficiência, sustentabilidade e inovação — em tempo real.
        </p>

        <div className="flex gap-10">
          <div>
            <p className="text-3xl font-bold text-eco-light">58</p>
            <p className="text-sm text-slate-300">Máquinas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-eco-light">87%</p>
            <p className="text-sm text-slate-300">Reciclagem</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-eco-light">94%</p>
            <p className="text-sm text-slate-300">Eficiência</p>
          </div>
        </div>
      </div>

      {/* Lado direito - formulário */}
      <div className="flex items-center justify-center p-8 bg-eco-bg">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Bem-vindo de volta</h2>
          <p className="text-sm text-slate-500 mb-6">Acesse o painel de controle industrial</p>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {erro}
            </p>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full bg-slate-100 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-eco-green/40"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-100 rounded-lg px-3 py-2.5 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-green/40"
          />

          <div className="flex items-center justify-between mb-5 text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded" /> Lembrar-me
            </label>
            <a href="#" className="text-eco-green font-medium">Esqueci minha senha</a>
          </div>

          <button
            type="submit"
            className="w-full bg-eco-green hover:bg-green-700 transition-colors text-white font-semibold py-2.5 rounded-lg"
          >
            Entrar
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Login simulado — qualquer e-mail e senha preenchidos dão acesso ao painel.
          </p>
        </form>
      </div>
    </div>
  )
}
