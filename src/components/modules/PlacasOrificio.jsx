import React, { useState, useEffect } from 'react'
import { 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Ruler,
  Settings,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Target
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

const PlacasOrificio = () => {
  const [placas, setPlacas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [placaToDelete, setPlacaToDelete] = useState(null)

  // Limpar dados fictícios ao carregar o componente
  useEffect(() => {
    const storedPlacas = localStorage.getItem('sgm_placas_orificio')
    if (storedPlacas) {
      try {
        const parsedPlacas = JSON.parse(storedPlacas)
        // Filtrar dados fictícios conhecidos
        const cleanPlacas = parsedPlacas.filter(placa => 
          !placa.codigo?.includes('PO-001') &&
          !placa.codigo?.includes('PO-002') &&
          !placa.codigo?.includes('PO-003') &&
          !placa.instalacao?.includes('Estação') &&
          !placa.instalacao?.includes('Unidade') &&
          !placa.instalacao?.includes('Terminal')
        )
        setPlacas(cleanPlacas)
        localStorage.setItem('sgm_placas_orificio', JSON.stringify(cleanPlacas))
      } catch (error) {
        setPlacas([])
      }
    }
  }, [])

  const statusConfig = {
    ativa: {
      label: 'Ativa',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    manutencao: {
      label: 'Manutenção',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    inativa: {
      label: 'Inativa',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
  }

  const conformidadeConfig = {
    'aga-3': {
      label: 'AGA-3',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    'iso-5167': {
      label: 'ISO 5167',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  }

  const handleCreatePlaca = () => {
    const novaPlaca = {
      id: Date.now(),
      codigo: `PO-${String(placas.length + 1).padStart(3, '0')}`,
      instalacao: 'Nova Instalação',
      diametro: '100',
      espessura: '3.0',
      material: 'Aço Inox 316',
      conformidade: 'aga-3',
      status: 'ativa',
      dataInstalacao: new Date().toISOString().split('T')[0],
      ultimaCalibacao: new Date().toISOString().split('T')[0],
      proximaCalibacao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsavel: 'Usuário Sistema'
    }

    const novasPlacas = [...placas, novaPlaca]
    setPlacas(novasPlacas)
    localStorage.setItem('sgm_placas_orificio', JSON.stringify(novasPlacas))
  }

  const handleEditPlaca = (placa) => {
    // Implementar modal de edição no futuro
    console.log('Editar placa:', placa)
  }

  const handleDeletePlaca = (placa) => {
    setPlacaToDelete(placa)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (placaToDelete) {
      const novasPlacas = placas.filter(p => p.id !== placaToDelete.id)
      setPlacas(novasPlacas)
      localStorage.setItem('sgm_placas_orificio', JSON.stringify(novasPlacas))
    }
    setShowDeleteModal(false)
    setPlacaToDelete(null)
  }

  const filteredPlacas = placas.filter(placa =>
    placa.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    placa.instalacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    placa.material?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: placas.length,
    ativas: placas.filter(p => p.status === 'ativa').length,
    manutencao: placas.filter(p => p.status === 'manutencao').length,
    vencidas: placas.filter(p => new Date(p.proximaCalibacao) < new Date()).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Placas de Orifício
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de placas de orifício para medição de vazão
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            AGA-3
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            ISO 5167
          </Badge>
          <Button onClick={handleCreatePlaca} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Placa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Placas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              placas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
            <p className="text-xs text-muted-foreground">
              em operação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
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
            <CardTitle className="text-sm font-medium">Calibração Vencida</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.vencidas}</div>
            <p className="text-xs text-muted-foreground">
              necessitam calibração
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
                  placeholder="Pesquisar placas..."
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
            {filteredPlacas.length} placas encontradas
          </div>

          {filteredPlacas.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma placa de orifício cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando sua primeira placa de orifício no sistema
              </p>
              <Button onClick={handleCreatePlaca} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Primeira Placa
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Instalação</TableHead>
                    <TableHead>Diâmetro</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Conformidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Calibração</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlacas.map((placa) => {
                    const StatusIcon = statusConfig[placa.status]?.icon || Circle
                    const isVencida = new Date(placa.proximaCalibacao) < new Date()
                    
                    return (
                      <TableRow key={placa.id}>
                        <TableCell className="font-medium">
                          {placa.codigo}
                        </TableCell>
                        <TableCell>{placa.instalacao}</TableCell>
                        <TableCell>{placa.diametro} mm</TableCell>
                        <TableCell>{placa.material}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={conformidadeConfig[placa.conformidade]?.color}
                          >
                            {conformidadeConfig[placa.conformidade]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              statusConfig[placa.status]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[placa.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            isVencida && "text-red-600 font-medium"
                          )}>
                            {formatDate(placa.proximaCalibacao)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {placa.responsavel?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{placa.responsavel}</span>
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
                              <DropdownMenuItem onClick={() => handleEditPlaca(placa)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeletePlaca(placa)}
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
              <CheckCircle className="h-5 w-5 text-green-600" />
              Conformidade AGA-3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Placas em conformidade com normas AGA-3 para medição de gás natural
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              Conformidade ISO 5167
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Placas em conformidade com normas ISO 5167 para medição de fluidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Controle de Calibração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema automatizado de controle de prazos de calibração
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
              Tem certeza que deseja excluir a placa "{placaToDelete?.codigo}"? 
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

export default PlacasOrificio

