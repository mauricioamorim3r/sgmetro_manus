import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Archive,
  Truck,
  Clock,
  MapPin,
  User,
  Calendar
} from 'lucide-react'

// Dados de estoque - inicialmente vazio para cadastro pelo usuário
const estoqueData = []

const Estoque = () => {
  const [itens, setItens] = useState(estoqueData)
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponível': return 'bg-green-100 text-green-800'
      case 'Estoque Baixo': return 'bg-yellow-100 text-yellow-800'
      case 'Esgotado': return 'bg-red-100 text-red-800'
      case 'Reservado': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Disponível': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Estoque Baixo': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'Esgotado': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const calcularValorTotal = (quantidade, valor_unitario) => {
    return (quantidade * valor_unitario).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const calcularPercentualEstoque = (quantidade, minimo, maximo) => {
    return Math.round((quantidade / maximo) * 100)
  }

  // Estatísticas do estoque
  const totalItens = itens.length
  const itensDisponiveis = itens.filter(item => item.status === 'Disponível').length
  const itensEstoqueBaixo = itens.filter(item => item.status === 'Estoque Baixo').length
  const itensEsgotados = itens.filter(item => item.status === 'Esgotado').length
  const valorTotalEstoque = itens.reduce((total, item) => total + (item.quantidade * item.valor_unitario), 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            Estoque
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de materiais e equipamentos
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            ✓ API Funcionando
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </button>
        </div>
      </div>

      {/* KPIs do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-2xl font-bold text-gray-900">{totalItens}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponíveis</p>
              <p className="text-2xl font-bold text-green-600">{itensDisponiveis}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-yellow-600">{itensEstoqueBaixo}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Esgotados</p>
              <p className="text-2xl font-bold text-red-600">{itensEsgotados}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-lg font-bold text-gray-900">
                {valorTotalEstoque.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
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
              placeholder="Pesquisar itens..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">15</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {itens.length} itens encontrados
        </div>
      </div>

      {/* Grid de Itens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {itens.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{item.codigo}</h3>
                    <p className="text-sm text-gray-600">{item.categoria}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <h4 className="text-sm font-medium text-gray-900 mb-2">{item.nome}</h4>
              
              {/* Quantidade e Barra de Progresso */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Quantidade</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.quantidade} {item.unidade}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.quantidade === 0 ? 'bg-red-500' :
                      item.quantidade <= item.minimo ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(calcularPercentualEstoque(item.quantidade, item.minimo, item.maximo), 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mín: {item.minimo}</span>
                  <span>Máx: {item.maximo}</span>
                </div>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="p-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {item.localizacao}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {item.responsavel}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                {item.fornecedor}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Valor Unitário</p>
                  <p className="text-sm font-medium text-gray-900">
                    {item.valor_unitario.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor Total</p>
                  <p className="text-sm font-medium text-gray-900">
                    {calcularValorTotal(item.quantidade, item.valor_unitario)}
                  </p>
                </div>
              </div>

              {item.observacoes && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Observações</p>
                  <p className="text-sm text-gray-700">{item.observacoes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  Entrada: {item.ultima_entrada}
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  Saída: {item.ultima_saida}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo do Estoque */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Controle de Estoque</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Alertas Automáticos</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Rastreabilidade</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Controle completo de materiais e equipamentos com gestão de estoque mínimo/máximo, alertas automáticos de reposição e rastreabilidade total dos itens.</p>
          <p className="mt-2">
            <strong>Sistema de Gerenciamento Metrológico</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export { Estoque }

