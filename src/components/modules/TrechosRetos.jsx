import React, { useState, useEffect } from 'react'
import { 
  Ruler, 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings,
  MapPin,
  Gauge,
  Wind,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Target
} from 'lucide-react'

// Dados de trechos retos - inicialmente vazio para cadastro pelo usuário
const trechosData = []

const TrechosRetos = () => {
  const [trechos, setTrechos] = useState(trechosData)
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Adequado': return 'bg-green-100 text-green-800'
      case 'Atenção': return 'bg-yellow-100 text-yellow-800'
      case 'Inadequado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConformidadeColor = (conformidade) => {
    switch (conformidade) {
      case 'Conforme': return 'bg-green-100 text-green-800'
      case 'Não conforme': return 'bg-red-100 text-red-800'
      case 'Parcial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calcularRazaoComprimento = (comprimento, diametro) => {
    const diametroNum = parseFloat(diametro.replace(' mm', '')) / 1000 // converter para metros
    const razao = parseFloat(comprimento.replace(' m', '')) / diametroNum
    return Math.round(razao * 10) / 10 // arredondar para 1 casa decimal
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Ruler className="h-8 w-8 mr-3 text-orange-600" />
            Trechos Retos
          </h1>
          <p className="text-gray-600 mt-1">
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          </span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            AGA-3
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            ISO 5167
          </span>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Trecho
          </button>
        </div>
      </div>

      {/* KPIs de Trechos Retos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Trechos</p>
              <p className="text-2xl font-bold text-gray-900">{trechos.length}</p>
            </div>
            <Ruler className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Adequados</p>
              <p className="text-2xl font-bold text-green-600">
                {trechos.filter(t => t.status === 'Adequado').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atenção</p>
              <p className="text-2xl font-bold text-yellow-600">
                {trechos.filter(t => t.status === 'Atenção').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conformidade AGA-3</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((trechos.filter(t => t.conformidade_aga3 === 'Conforme').length / trechos.length) * 100)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
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
              placeholder="Pesquisar trechos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">8</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {trechos.length} trechos encontrados
        </div>
      </div>

      {/* Grid de Trechos Retos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {trechos.map((trecho) => (
          <div key={trecho.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 text-orange-600" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{trecho.id}</h3>
                    <p className="text-sm text-gray-600">{trecho.ponto_medicao}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trecho.status)}`}>
                  {trecho.status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{trecho.localizacao}</h4>
                <p className="text-sm text-gray-600">{trecho.instalacao}</p>
              </div>

              {/* Dimensões */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center bg-orange-50 p-3 rounded">
                  <p className="text-xs text-orange-600">Diâmetro Nominal</p>
                  <p className="text-lg font-bold text-orange-800">{trecho.diametro_nominal}</p>
                </div>
                <div className="text-center bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-600">Diâmetro Interno</p>
                  <p className="text-sm font-bold text-blue-800">{trecho.diametro_interno}</p>
                </div>
              </div>
            </div>

            {/* Comprimentos */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-green-600" />
                Comprimentos de Trecho Reto
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowLeft className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Montante:</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{trecho.comprimento_montante}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({calcularRazaoComprimento(trecho.comprimento_montante, trecho.diametro_interno)}D)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Jusante:</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{trecho.comprimento_jusante}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({calcularRazaoComprimento(trecho.comprimento_jusante, trecho.diametro_interno)}D)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Propriedades do Fluido */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Wind className="h-4 w-4 mr-2 text-purple-600" />
                Propriedades do Escoamento
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Reynolds</p>
                  <p className="font-medium text-gray-900">{trecho.reynolds}</p>
                </div>
                <div>
                  <p className="text-gray-500">Perfil</p>
                  <p className="font-medium text-gray-900">{trecho.perfil_velocidade}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p className="font-medium text-gray-900">{trecho.material}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rugosidade</p>
                  <p className="font-medium text-gray-900">{trecho.rugosidade}</p>
                </div>
              </div>
            </div>

            {/* Conformidade */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Conformidade com Normas
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AGA-3:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConformidadeColor(trecho.conformidade_aga3)}`}>
                    {trecho.conformidade_aga3}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ISO 5167:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConformidadeColor(trecho.conformidade_iso5167)}`}>
                    {trecho.conformidade_iso5167}
                  </span>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                  <p className="text-gray-500">Responsável</p>
                  <p className="font-medium text-gray-900">{trecho.responsavel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Última Inspeção</p>
                  <p className="font-medium text-gray-900">{trecho.ultima_inspecao}</p>
                </div>
              </div>

              {trecho.observacoes && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Observações</p>
                  <p className="text-sm text-gray-700">{trecho.observacoes}</p>
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
            <span className="text-sm font-medium text-green-700">Normas AGA-3 e ISO 5167</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Validação Automática</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="mt-2">
          </p>
          <p className="mt-2 text-xs">
            <strong>Módulo Trechos Retos - Conforme AGA-3 e ISO 5167-2</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export { TrechosRetos }

