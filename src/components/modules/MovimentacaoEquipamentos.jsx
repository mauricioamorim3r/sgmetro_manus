import React, { useState, useEffect } from 'react'
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  User,
  FileText
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

const MovimentacaoEquipamentos = () => {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [movimentacaoToDelete, setMovimentacaoToDelete] = useState(null)

  // Limpar dados fictícios ao carregar o componente
  useEffect(() => {
    const storedMovimentacoes = localStorage.getItem('sgm_movimentacao_equipamentos')
    if (storedMovimentacoes) {
      try {
        const parsedMovimentacoes = JSON.parse(storedMovimentacoes)
        // Filtrar dados fictícios conhecidos
        const cleanMovimentacoes = parsedMovimentacoes.filter(mov => 
          !mov.numeroOS?.includes('OS-001') &&
          !mov.numeroOS?.includes('OS-002') &&
          !mov.numeroOS?.includes('OS-003') &&
          !mov.origem?.includes('Estação') &&
          !mov.origem?.includes('Unidade') &&
          !mov.origem?.includes('Terminal')
        )
        setMovimentacoes(cleanMovimentacoes)
        localStorage.setItem('sgm_movimentacao_equipamentos', JSON.stringify(cleanMovimentacoes))
      } catch (error) {
        setMovimentacoes([])
      }
    }
  }, [])

  const statusConfig = {
    planejada: {
      label: 'Planejada',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Calendar,
    },
    'em-andamento': {
      label: 'Em Andamento',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Truck,
    },
    concluida: {
      label: 'Concluída',
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
    transferencia: {
      label: 'Transferência',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ArrowRightLeft,
    },
    instalacao: {
      label: 'Instalação',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Package,
    },
    remocao: {
      label: 'Remoção',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: Truck,
    },
    manutencao: {
      label: 'Manutenção',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Clock,
    },
  }

  const handleCreateMovimentacao = () => {
    const novaMovimentacao = {
      id: Date.now(),
      numeroOS: `OS-${String(movimentacoes.length + 1).padStart(4, '0')}`,
      equipamento: 'EQ-001',
      descricaoEquipamento: 'Novo Equipamento',
      tipo: 'transferencia',
      origem: 'Instalação Origem',
      destino: 'Instalação Destino',
      status: 'planejada',
      dataInicio: new Date().toISOString().split('T')[0],
      dataPrevisao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dataConclusao: null,
      responsavel: 'Usuário Sistema',
      observacoes: 'Movimentação criada pelo sistema'
    }

    const novasMovimentacoes = [...movimentacoes, novaMovimentacao]
    setMovimentacoes(novasMovimentacoes)
    localStorage.setItem('sgm_movimentacao_equipamentos', JSON.stringify(novasMovimentacoes))
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
      localStorage.setItem('sgm_movimentacao_equipamentos', JSON.stringify(novasMovimentacoes))
    }
    setShowDeleteModal(false)
    setMovimentacaoToDelete(null)
  }

  const filteredMovimentacoes = movimentacoes.filter(movimentacao =>
    movimentacao.numeroOS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.equipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.descricaoEquipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.origem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: movimentacoes.length,
    planejadas: movimentacoes.filter(m => m.status === 'planejada').length,
    emAndamento: movimentacoes.filter(m => m.status === 'em-andamento').length,
    concluidas: movimentacoes.filter(m => m.status === 'concluida').length,
    atrasadas: movimentacoes.filter(m => 
      m.status !== 'concluida' && 
      new Date(m.dataPrevisao) < new Date()
    ).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="h-8 w-8 text-blue-600" />
            Movimentação de Equipamentos
          </h1>
          <p className="text-muted-foreground">
            Controle de movimentação e transferência de equipamentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Controle Total
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Rastreabilidade
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
            <FileText className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Planejadas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.planejadas}</div>
            <p className="text-xs text-muted-foreground">
              aguardando execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Truck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</div>
            <p className="text-xs text-muted-foreground">
              sendo executadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
            <p className="text-xs text-muted-foreground">
              finalizadas
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
              <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma movimentação cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando sua primeira movimentação de equipamento
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
                    <TableHead>OS</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Origem → Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Previsão</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimentacoes.map((movimentacao) => {
                    const StatusIcon = statusConfig[movimentacao.status]?.icon || Clock
                    const TipoIcon = tipoConfig[movimentacao.tipo]?.icon || ArrowRightLeft
                    const isAtrasada = movimentacao.status !== 'concluida' && 
                                      new Date(movimentacao.dataPrevisao) < new Date()
                    
                    return (
                      <TableRow key={movimentacao.id}>
                        <TableCell className="font-medium">
                          {movimentacao.numeroOS}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movimentacao.equipamento}</div>
                            <div className="text-sm text-muted-foreground">
                              {movimentacao.descricaoEquipamento}
                            </div>
                          </div>
                        </TableCell>
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
                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{movimentacao.destino}</span>
                          </div>
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
                                {movimentacao.responsavel?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{movimentacao.responsavel}</span>
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
                                <FileText className="mr-2 h-4 w-4" />
                                Relatório
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
              <MapPin className="h-5 w-5 text-blue-600" />
              Rastreabilidade Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Controle total da localização e histórico de movimentação dos equipamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Planejamento Integrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema integrado de planejamento e execução de movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documentação Automática
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Geração automática de relatórios e documentação das movimentações
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
              Tem certeza que deseja excluir a movimentação "{movimentacaoToDelete?.numeroOS}"? 
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

export default MovimentacaoEquipamentos

