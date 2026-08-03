const cores = {
  // status de máquinas
  Operando: 'bg-green-100 text-green-700',
  Manutenção: 'bg-orange-100 text-orange-700',
  Parada: 'bg-red-100 text-red-700',
  Desativada: 'bg-slate-100 text-slate-500',
  // nível de risco
  Baixo: 'bg-green-100 text-green-700',
  Médio: 'bg-yellow-100 text-yellow-700',
  Alto: 'bg-orange-100 text-orange-700',
  Crítico: 'bg-red-100 text-red-700',
}

export default function Badge({ valor }) {
  const classe = cores[valor] || 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${classe}`}>
      ● {valor}
    </span>
  )
}
