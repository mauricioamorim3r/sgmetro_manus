import React, { useState, useEffect } from 'react'
import { 
  Calculator, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Settings,
  Plus,
  Search,
  Filter,
  Gauge,
  Zap,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react'

// Dados de incertezas de medição - inicialmente vazio para cadastro pelo usuário
const incertezasData = []

const Incertezas = () => {
  const [incertezas, setIncertezas] = useState(incertezasData)
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Válida': return 'bg-green-100 text-green-800'
      case 'Revisão Necessária': return 'bg-red-100 text-red-800'
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGrandezaIcon = (grandeza) => {
    if (grandeza.includes('Vazão')) return <Wind className="h-4 w-4 text-blue-600" />
    if (grandeza.includes('Pressão')) return <Gauge className="h-4 w-4 text-purple-600" />
    if (grandeza.includes('Temperatura')) return <Thermometer className="h-4 w-4 text-red-600" />
    if (grandeza.includes('Densidade')) return <Droplets className="h-4 w-4 text-cyan-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const calcularIncertezaRelativa = (incerteza) => {
    const valor = parseFloat(incerteza.replace('±', '').replace('%', ''))
    if (valor <= 1) return 'Excelente'
    if (valor <= 2.5) return 'Boa'
    if (valor <= 5) return 'Aceitável'
    return 'Revisar'
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-indigo-600" />
            Incertezas de Medição
          </h1>
          <p className="text-gray-600 mt-1">
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          </span>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            GUM
          </span>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Incerteza
          </button>
        </div>
      </div>

      {/* KPIs de Incertezas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Incertezas</p>
              <p className="text-2xl font-bold text-gray-900">{incertezas.length}</p>
            </div>
            <Calculator className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Válidas</p>
              <p className="text-2xl font-bold text-green-600">
                {incertezas.filter(i => i.status === 'Válida').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revisão Necessária</p>
              <p className="text-2xl font-bold text-red-600">
                {incertezas.filter(i => i.status === 'Revisão Necessária').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Método GUM</p>
              <p className="text-2xl font-bold text-indigo-600">100%</p>
            </div>
            <Target className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar incertezas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">12</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {incertezas.length} incertezas encontradas
        </div>
      </div>

      {/* Grid de Incertezas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {incertezas.map((incerteza) => (
          <div key={incerteza.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getGrandezaIcon(incerteza.grandeza)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{incerteza.id}</h3>
                    <p className="text-sm text-gray-600">{incerteza.ponto_medicao}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incerteza.status)}`}>
                  {incerteza.status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{incerteza.grandeza}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">
                    {incerteza.valor_medido} {incerteza.unidade}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {incerteza.incerteza_expandida}
                  </span>
                </div>
              </div>

              {/* Qualidade da Incerteza */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Qualidade</span>
                  <span className={`text-sm font-medium ${
                    calcularIncertezaRelativa(incerteza.incerteza_expandida) === 'Excelente' ? 'text-green-600' :
                    calcularIncertezaRelativa(incerteza.incerteza_expandida) === 'Boa' ? 'text-blue-600' :
                    calcularIncertezaRelativa(incerteza.incerteza_expandida) === 'Aceitável' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {calcularIncertezaRelativa(incerteza.incerteza_expandida)}
                  </span>
                </div>
              </div>
            </div>

            {/* Componentes de Incerteza */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-indigo-600" />
                Componentes de Incerteza
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo A (estatística):</span>
                  <span className="font-medium text-blue-600">{incerteza.componentes.tipo_a}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo B (outras):</span>
                  <span className="font-medium text-purple-600">{incerteza.componentes.tipo_b}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Combinada:</span>
                  <span className="font-medium text-gray-900">{incerteza.componentes.combinada}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expandida ({incerteza.fator_cobertura}):</span>
                  <span className="font-bold text-red-600">{incerteza.incerteza_expandida}</span>
                </div>
              </div>
            </div>

            {/* Fontes de Incerteza */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-orange-600" />
                Fontes de Incerteza
              </h4>
              <div className="space-y-1">
                {incerteza.fontes_incerteza.map((fonte, index) => (
                  <div key={index} className="text-xs bg-orange-50 text-orange-800 px-2 py-1 rounded">
                    {fonte}
                  </div>
                ))}
              </div>
            </div>

            {/* Informações Técnicas */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500">Método</p>
                  <p className="font-medium text-gray-900">{incerteza.metodo_calculo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Confiança</p>
                  <p className="font-medium text-gray-900">{incerteza.nivel_confianca}</p>
                </div>
                <div>
                  <p className="text-gray-500">Responsável</p>
                  <p className="font-medium text-gray-900">{incerteza.responsavel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Próxima Revisão</p>
                  <p className="font-medium text-gray-900">{incerteza.proxima_revisao}</p>
                </div>
              </div>

              {incerteza.observacoes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Observações</p>
                  <p className="text-sm text-gray-700">{incerteza.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Informativo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Método GUM Implementado</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">ISO/IEC Guide 98-3</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="mt-2">
          </p>
          <p className="mt-2 text-xs">
            <strong>Módulo Incertezas de Medição - Conforme ISO/IEC Guide 98-3 (GUM)</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export { Incertezas }

