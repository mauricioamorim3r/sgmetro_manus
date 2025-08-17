import React, { useState, useEffect } from 'react'
import { 
  Move, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  Package,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  FileText,
  MapPin,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn, animations, effects, formatDate, statusColors } from '@/lib/utils'

const MovimentacaoGeral = () => {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [movimentacaoToDelete, setMovimentacaoToDelete] = useState(null)

  // Limpar dados fictícios ao carregar o componente
  useEffect(() => {
    const storedMovimentacoes = localStorage.getItem('sgm_movimentacao_geral')
    if (storedMovimentacoes) {
      try {
        const parsedMovimentacoes = JSON.parse(storedMovimentacoes)
        // Filtrar dados fictícios conhecidos
        const cleanMovimentacoes = parsedMovimentacoes.filter(mov => 
          !mov.codigo?.includes('MOV-001') &&
          !mov.codigo?.includes('MOV-002') &&
          !mov.codigo?.includes('MOV-003') &&
          !mov.origem?.includes('Estação') &&
          !mov.origem?.includes('Unidade') &&
          !mov.origem?.includes('Terminal')
        )
        setMovimentacoes(cleanMovimentacoes)
        localStorage.setItem('sgm_movimentacao_geral', JSON.stringify(cleanMovimentacoes))
      } catch (error) {
        setMovimentacoes([])
      }
    }
  }, [])

  const statusConfig = {
    pendente: {
      label: 'Pendente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    'em-transito': {
      label: 'Em Trânsito',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Truck,
    },
    entregue: {
      label: 'Entregue',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    cancelada: {
      label: 'Cancelada',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
  }

  const tipoConfig = {
    material: {
      label: 'Material',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Package,
    },
    equipamento: {
      label: 'Equipamento',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Activity,
    },
    ferramenta: {
      label: 'Ferramenta',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Move,
    },
    documento: {
      label: 'Documento',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: FileText,
    },
  }

  const handleCreateMovimentacao = () => {
    const novaMovimentacao = {
      id: Date.now(),
      codigo: `MOV-${String(movimentacoes.length + 1).padStart(4, '0')}`,
      descricao: 'Nova Movimentação',
      tipo: 'material',
      origem: 'Local Origem',
      destino: 'Local Destino',
      quantidade: 1,
      unidade: 'UN',
      status: 'pendente',
      dataSolicitacao: new Date().toISOString().split('T')[0],
      dataPrevisao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dataEntrega: null,
      solicitante: 'Usuário Sistema',
      responsavel: 'Usuário Sistema',
      observacoes: 'Movimentação criada pelo sistema'
    }

    const novasMovimentacoes = [...movimentacoes, novaMovimentacao]
    setMovimentacoes(novasMovimentacoes)
    localStorage.setItem('sgm_movimentacao_geral', JSON.stringify(novasMovimentacoes))
  }

  const handleEditMovimentacao = (movimentacao) => {
    // Implementar modal de edição no futuro
    console.log('Editar movimentação:', movimentacao)
  }

  const handleDeleteMovimentacao = (movimentacao) => {
    setMovimentacaoToDelete(movimentacao)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (movimentacaoToDelete) {
      const novasMovimentacoes = movimentacoes.filter(m => m.id !== movimentacaoToDelete.id)
      setMovimentacoes(novasMovimentacoes)
      localStorage.setItem('sgm_movimentacao_geral', JSON.stringify(novasMovimentacoes))
    }
    setShowDeleteModal(false)
    setMovimentacaoToDelete(null)
  }

  const filteredMovimentacoes = movimentacoes.filter(movimentacao =>
    movimentacao.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.origem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.solicitante?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: movimentacoes.length,
    pendentes: movimentacoes.filter(m => m.status === 'pendente').length,
    emTransito: movimentacoes.filter(m => m.status === 'em-transito').length,
    entregues: movimentacoes.filter(m => m.status === 'entregue').length,
    atrasadas: movimentacoes.filter(m => 
      m.status !== 'entregue' && 
      new Date(m.dataPrevisao) < new Date()
    ).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Move className="h-8 w-8 text-blue-600" />
            Movimentação
          </h1>
          <p className="text-muted-foreground">
            Controle de movimentação geral de materiais, equipamentos e documentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Logística
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Controle Total
          </Badge>
          <Button onClick={handleCreateMovimentacao} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Move className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">
              aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Trânsito</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.emTransito}</div>
            <p className="text-xs text-muted-foreground">
              em movimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.entregues}</div>
            <p className="text-xs text-muted-foreground">
              concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.atrasadas}</div>
            <p className="text-xs text-muted-foreground">
              fora do prazo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar movimentações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            {filteredMovimentacoes.length} movimentações encontradas
          </div>

          {filteredMovimentacoes.length === 0 ? (
            <div className="text-center py-12">
              <Move className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma movimentação cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando sua primeira movimentação no sistema
              </p>
              <Button onClick={handleCreateMovimentacao} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Primeira Movimentação
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Origem → Destino</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Previsão</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimentacoes.map((movimentacao) => {
                    const StatusIcon = statusConfig[movimentacao.status]?.icon || Clock
                    const TipoIcon = tipoConfig[movimentacao.tipo]?.icon || Package
                    const isAtrasada = movimentacao.status !== 'entregue' && 
                                      new Date(movimentacao.dataPrevisao) < new Date()
                    
                    return (
                      <TableRow key={movimentacao.id}>
                        <TableCell className="font-medium">
                          {movimentacao.codigo}
                        </TableCell>
                        <TableCell>{movimentacao.descricao}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              tipoConfig[movimentacao.tipo]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <TipoIcon className="h-3 w-3" />
                            {tipoConfig[movimentacao.tipo]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{movimentacao.origem}</span>
                            <Move className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{movimentacao.destino}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {movimentacao.quantidade} {movimentacao.unidade}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              statusConfig[movimentacao.status]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[movimentacao.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            isAtrasada && "text-red-600 font-medium"
                          )}>
                            {formatDate(movimentacao.dataPrevisao)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {movimentacao.solicitante?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{movimentacao.solicitante}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditMovimentacao(movimentacao)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MapPin className="mr-2 h-4 w-4" />
                                Rastrear
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMovimentacao(movimentacao)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Logística Integrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema completo de gerenciamento logístico e controle de movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Rastreamento em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acompanhamento em tempo real do status e localização das movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documentação Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registro completo e documentação automática de todas as movimentações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a movimentação "{movimentacaoToDelete?.codigo}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MovimentacaoGeral

