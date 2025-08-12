import React, { useState, useEffect } from 'react'
import { Building, Plus, Search, Filter, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, animations, effects } from '@/lib/utils'

export function Instalacoes() {
  const [instalacoes, setInstalacoes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Garantir que sempre carregue dados limpos
  useEffect(() => {
    // Forçar limpeza de qualquer dado fictício
    const loadInstalacoes = () => {
      try {
        const saved = localStorage.getItem('sgm_instalacoes')
        if (saved) {
          const data = JSON.parse(saved)
          // Filtrar apenas dados reais (sem dados fictícios conhecidos)
          const realData = data.filter(item => 
            !item.nome?.includes('SE-001') && 
            !item.nome?.includes('BA-002') && 
            !item.nome?.includes('AL-001') &&
            !item.nome?.includes('Estação de Medição') &&
            !item.nome?.includes('Unidade de Processamento') &&
            !item.nome?.includes('Terminal de Transferência')
          )
          setInstalacoes(realData)
          // Salvar dados limpos de volta
          localStorage.setItem('sgm_instalacoes', JSON.stringify(realData))
        } else {
          // Garantir array vazio se não há dados
          setInstalacoes([])
          localStorage.setItem('sgm_instalacoes', JSON.stringify([]))
        }
      } catch (error) {
        console.error('Erro ao carregar instalações:', error)
        setInstalacoes([])
        localStorage.setItem('sgm_instalacoes', JSON.stringify([]))
      }
    }

    loadInstalacoes()
  }, [])

  // Função para salvar instalações no localStorage
  const saveInstalacoes = (data) => {
    try {
      localStorage.setItem('sgm_instalacoes', JSON.stringify(data))
      setInstalacoes(data)
    } catch (error) {
      console.error('Erro ao salvar instalações:', error)
    }
  }

  // Função para deletar instalação
  const handleDelete = (id) => {
    const updatedInstalacoes = instalacoes.filter(item => item.id !== id)
    saveInstalacoes(updatedInstalacoes)
    setShowDeleteConfirm(null)
  }

  // Função para criar nova instalação (placeholder)
  const handleCreate = () => {
    const newInstalacao = {
      id: Date.now().toString(),
      nome: 'Nova Instalação',
      codigo: 'INST-' + Date.now(),
      status: 'Ativo',
      polo: 'Definir Polo',
      tipo: 'Definir Tipo',
      localizacao: 'Definir Localização',
      equipamentos: 0,
      createdAt: new Date().toISOString()
    }
    const updatedInstalacoes = [...instalacoes, newInstalacao]
    saveInstalacoes(updatedInstalacoes)
  }

  // Função para editar instalação (placeholder)
  const handleEdit = (id) => {
    console.log('Editar instalação:', id)
    // Implementar modal de edição futuramente
  }

  const filteredInstalacoes = instalacoes.filter(instalacao =>
    instalacao.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instalacao.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building className="h-8 w-8 text-purple-600" />
            Instalações
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de instalações do sistema metrológico
          </p>
        </div>
        <Button onClick={handleCreate} className={cn(animations.hoverLift)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Instalação
        </Button>
      </div>

      {/* Filters */}
      <Card className={cn(effects.shadow.sm)}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar instalações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className={cn(animations.hoverLift)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {filteredInstalacoes.length === 0 ? (
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma instalação cadastrada</h3>
              <p className="text-muted-foreground mb-6">
                Comece cadastrando sua primeira instalação no sistema
              </p>
              <Button onClick={handleCreate} className={cn(animations.hoverLift)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Instalação
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInstalacoes.map((instalacao, index) => (
            <Card key={index} className={cn(
              "transition-all duration-200",
              animations.hoverLift,
              effects.shadow.sm
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{instalacao.nome}</CardTitle>
                  <Badge variant="outline">{instalacao.status}</Badge>
                </div>
                <CardDescription>{instalacao.codigo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Polo:</span> {instalacao.polo}</p>
                  <p><span className="font-medium">Tipo:</span> {instalacao.tipo}</p>
                  <p><span className="font-medium">Localização:</span> {instalacao.localizacao}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(instalacao.id)}
                    className={cn(animations.hoverLift)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(instalacao.id)}
                    className={cn(animations.hoverLift, "text-red-600 hover:text-red-700")}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirmar Exclusão
              </CardTitle>
              <CardDescription>
                Tem certeza que deseja excluir esta instalação? Esta ação não pode ser desfeita.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(null)}
                  className={cn(animations.hoverLift)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className={cn(animations.hoverLift)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

