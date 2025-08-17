import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Wrench,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  Zap,
  Gauge
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

const GestaoEquipamentos = () => {
  const [equipamentos, setEquipamentos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [equipamentoToDelete, setEquipamentoToDelete] = useState(null)

  // Limpar dados fictícios ao carregar o componente
  useEffect(() => {
    const storedEquipamentos = localStorage.getItem('sgm_equipamentos')
    if (storedEquipamentos) {
      try {
        const parsedEquipamentos = JSON.parse(storedEquipamentos)
        // Filtrar dados fictícios conhecidos
        const cleanEquipamentos = parsedEquipamentos.filter(equip => 
          !equip.tag?.includes('EQ-001') &&
          !equip.tag?.includes('EQ-002') &&
          !equip.tag?.includes('EQ-003') &&
          !equip.instalacao?.includes('Estação') &&
          !equip.instalacao?.includes('Unidade') &&
          !equip.instalacao?.includes('Terminal')
        )
        setEquipamentos(cleanEquipamentos)
        localStorage.setItem('sgm_equipamentos', JSON.stringify(cleanEquipamentos))
      } catch (error) {
        setEquipamentos([])
      }
    }
  }, [])

  const statusConfig = {
    operacional: {
      label: 'Operacional',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    manutencao: {
      label: 'Manutenção',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Wrench,
    },
    parado: {
      label: 'Parado',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
    standby: {
      label: 'Stand-by',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Clock,
    },
  }

  const tipoConfig = {
    medidor: {
      label: 'Medidor',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Gauge,
    },
    transmissor: {
      label: 'Transmissor',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Zap,
    },
    valvula: {
      label: 'Válvula',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Settings,
    },
    sensor: {
      label: 'Sensor',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Activity,
    },
  }

  const handleCreateEquipamento = () => {
    const novoEquipamento = {
      id: Date.now(),
      tag: `EQ-${String(equipamentos.length + 1).padStart(3, '0')}`,
      descricao: 'Novo Equipamento',
      tipo: 'medidor',
      fabricante: 'Fabricante',
      modelo: 'Modelo',
      numeroSerie: `SN${Date.now()}`,
      instalacao: 'Nova Instalação',
      localizacao: 'Localização',
      status: 'operacional',
      dataInstalacao: new Date().toISOString().split('T')[0],
      ultimaManutencao: new Date().toISOString().split('T')[0],
      proximaManutencao: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsavel: 'Usuário Sistema'
    }

    const novosEquipamentos = [...equipamentos, novoEquipamento]
    setEquipamentos(novosEquipamentos)
    localStorage.setItem('sgm_equipamentos', JSON.stringify(novosEquipamentos))
  }

  const handleEditEquipamento = (equipamento) => {
    // Implementar modal de edição no futuro
    console.log('Editar equipamento:', equipamento)
  }

  const handleDeleteEquipamento = (equipamento) => {
    setEquipamentoToDelete(equipamento)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (equipamentoToDelete) {
      const novosEquipamentos = equipamentos.filter(e => e.id !== equipamentoToDelete.id)
      setEquipamentos(novosEquipamentos)
      localStorage.setItem('sgm_equipamentos', JSON.stringify(novosEquipamentos))
    }
    setShowDeleteModal(false)
    setEquipamentoToDelete(null)
  }

  const filteredEquipamentos = equipamentos.filter(equipamento =>
    equipamento.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.fabricante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: equipamentos.length,
    operacional: equipamentos.filter(e => e.status === 'operacional').length,
    manutencao: equipamentos.filter(e => e.status === 'manutencao').length,
    parado: equipamentos.filter(e => e.status === 'parado').length,
    vencidos: equipamentos.filter(e => new Date(e.proximaManutencao) < new Date()).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Gestão de Equipamentos
          </h1>
          <p className="text-muted-foreground">
            Controle e gerenciamento de equipamentos do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Operacional
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Monitoramento 24/7
          </Badge>
          <Button onClick={handleCreateEquipamento} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              equipamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operacional</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.operacional}</div>
            <p className="text-xs text-muted-foreground">
              funcionando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.manutencao}</div>
            <p className="text-xs text-muted-foreground">
              em manutenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parados</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.parado}</div>
            <p className="text-xs text-muted-foreground">
              fora de operação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção Vencida</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.vencidos}</div>
            <p className="text-xs text-muted-foreground">
              necessitam manutenção
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
                  placeholder="Pesquisar equipamentos..."
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
            {filteredEquipamentos.length} equipamentos encontrados
          </div>

          {filteredEquipamentos.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum equipamento cadastrado
              </h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando seu primeiro equipamento no sistema
              </p>
              <Button onClick={handleCreateEquipamento} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Primeiro Equipamento
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TAG</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fabricante/Modelo</TableHead>
                    <TableHead>Instalação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Manutenção</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipamentos.map((equipamento) => {
                    const StatusIcon = statusConfig[equipamento.status]?.icon || Settings
                    const TipoIcon = tipoConfig[equipamento.tipo]?.icon || Package
                    const isVencido = new Date(equipamento.proximaManutencao) < new Date()
                    
                    return (
                      <TableRow key={equipamento.id}>
                        <TableCell className="font-medium">
                          {equipamento.tag}
                        </TableCell>
                        <TableCell>{equipamento.descricao}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              tipoConfig[equipamento.tipo]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <TipoIcon className="h-3 w-3" />
                            {tipoConfig[equipamento.tipo]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{equipamento.fabricante}</div>
                            <div className="text-sm text-muted-foreground">{equipamento.modelo}</div>
                          </div>
                        </TableCell>
                        <TableCell>{equipamento.instalacao}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              statusConfig[equipamento.status]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[equipamento.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            isVencido && "text-red-600 font-medium"
                          )}>
                            {formatDate(equipamento.proximaManutencao)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {equipamento.responsavel?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{equipamento.responsavel}</span>
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
                              <DropdownMenuItem onClick={() => handleEditEquipamento(equipamento)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Wrench className="mr-2 h-4 w-4" />
                                Manutenção
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEquipamento(equipamento)}
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
              <Activity className="h-5 w-5 text-green-600" />
              Monitoramento em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acompanhamento contínuo do status e performance dos equipamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Programação de Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema automatizado de agendamento e controle de manutenções
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Controle de Inventário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestão completa do inventário de equipamentos e componentes
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
              Tem certeza que deseja excluir o equipamento "{equipamentoToDelete?.tag}"? 
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

export default GestaoEquipamentos

