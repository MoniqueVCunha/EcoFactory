import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Maquinas from './pages/Maquinas'
import Producao from './pages/Producao'
import Sustentabilidade from './pages/Sustentabilidade'
import Seguranca from './pages/Seguranca'

const usuarioLogado = { nome: 'Maria Engel', cargo: 'Engenheira de Produção', iniciais: 'ME' }

export default function App() {
  const [autenticado, setAutenticado] = useState(false)

  if (!autenticado) {
    return <Login onEntrar={() => setAutenticado(true)} />
  }

  return (
    <div className="flex">
      <Sidebar usuario={usuarioLogado} onSair={() => setAutenticado(false)} />
      <main className="flex-1 p-6 md:p-8 bg-eco-bg min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/maquinas" element={<Maquinas />} />
          <Route path="/producao" element={<Producao />} />
          <Route path="/sustentabilidade" element={<Sustentabilidade />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
