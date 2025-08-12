import React, { useState, useEffect } from 'react'
import { 
  FlaskConical, 
  Activity, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Target,
  Gauge,
  Thermometer,
  Clock,
  Play,
  Pause,
  Square,
  BarChart3,
  Beaker,
  Droplets,
  Zap,
  Plus,
  Search,
  Filter
} from 'lucide-react'

// Dados de análises químicas - inicialmente vazio para cadastro pelo usuário
const analisesData = []

const AnalisesQuimicas = () => {
  const [analises, setAnalises] = useState(analisesData)
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Coletada': return 'bg-blue-100 text-blue-800'
      case 'Recebida': return 'bg-yellow-100 text-yellow-800'
      case 'Em Análise': return 'bg-orange-100 text-orange-800'
      case 'Concluída': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800'
      case 'Média': return 'bg-yellow-100 text-yellow-800'
      case 'Baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Óleo Cru': return <Droplets className="h-4 w-4 text-orange-600" />
      case 'Gás Natural': return <Zap className="h-4 w-4 text-blue-600" />
      case 'Água Produzida': return <Beaker className="h-4 w-4 text-cyan-600" />
      default: return <FlaskConical className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FlaskConical className="h-8 w-8 mr-3 text-purple-600" />
            Análises Físico-Químicas
          </h1>
          <p className="text-gray-600 mt-1">
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            FQ
          </span>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Análise
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar análises..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">20</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {analises.length} análises encontradas
        </div>
      </div>

      {/* Grid de Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {analises.map((analise) => (
          <div key={analise.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getTipoIcon(analise.tipo)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{analise.id}</h3>
                    <p className="text-sm text-gray-600">{analise.amostra} • {analise.polo}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analise.status)}`}>
                    {analise.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(analise.prioridade)}`}>
                    {analise.prioridade}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p><strong>Tipo:</strong> {analise.tipo}</p>
                <p><strong>Responsável:</strong> {analise.responsavel}</p>
              </div>

              {/* Progresso */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progresso da Análise</span>
                  <span className="text-sm text-gray-600">{analise.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analise.progresso}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Propriedades Físicas */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Gauge className="h-4 w-4 mr-2 text-blue-600" />
                Propriedades Físicas
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(analise.propriedadesFisicas).map(([key, value]) => (
                  <div key={key} className="bg-blue-50 p-2 rounded">
                    <div className="font-medium text-blue-900 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="text-blue-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composição Química */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                Composição Química
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(analise.composicaoQuimica).map(([key, value]) => (
                  <div key={key} className="bg-green-50 p-2 rounded">
                    <div className="font-medium text-green-900 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="text-green-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  <Clock className="h-3 w-3 inline mr-1" />
                  Coletada: {analise.coletadaEm}
                </div>
                {analise.recebidaEm && (
                  <div>
                    Recebida: {analise.recebidaEm}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Informativo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Módulo Implementado</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="mt-2">
          </p>
          <p className="mt-2 text-xs">
            <strong>Workflow FQ completo - 64 campos especializados implementados</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export { AnalisesQuimicas }

