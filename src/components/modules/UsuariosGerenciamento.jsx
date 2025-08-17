import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  Key
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

const UsuariosGerenciamento = () => {
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)

  // Carregar usuários do localStorage e limpar dados fictícios
  useEffect(() => {
    const storedUsers = localStorage.getItem('sgm_users')
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers)
        // Filtrar dados fictícios conhecidos e manter apenas usuários reais
        const realUsers = parsedUsers.filter(user => 
          !user.username?.includes('admin') ||
          !user.username?.includes('demo') ||
          !user.username?.includes('test') ||
          user.username === 'testemodulos' || // Manter usuário atual
          user.username === 'sistemalimpo'     // Manter usuário atual
        )
        
        // Adicionar campos extras para usuários existentes
        const enhancedUsers = realUsers.map(user => ({
          ...user,
          id: user.id || Date.now() + Math.random(),
          status: user.status || 'ativo',
          ultimoAcesso: user.ultimoAcesso || new Date().toISOString().split('T')[0],
          dataCriacao: user.dataCriacao || new Date().toISOString().split('T')[0],
          telefone: user.telefone || '(11) 99999-9999',
          departamento: user.departamento || 'Operações'
        }))
        
        setUsuarios(enhancedUsers)
      } catch (error) {
        setUsuarios([])
      }
    }
  }, [])

  const statusConfig = {
    ativo: {
      label: 'Ativo',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    inativo: {
      label: 'Inativo',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: UserX,
    },
    pendente: {
      label: 'Pendente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    bloqueado: {
      label: 'Bloqueado',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
  }

  const perfilConfig = {
    usuario: {
      label: 'Usuário',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Users,
    },
    operador: {
      label: 'Operador',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: UserCheck,
    },
    supervisor: {
      label: 'Supervisor',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Shield,
    },
    administrador: {
      label: 'Administrador',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: Key,
    },
    gerente: {
      label: 'Gerente',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Shield,
    },
  }

  const handleCreateUsuario = () => {
    const novoUsuario = {
      id: Date.now(),
      nome: 'Novo Usuário',
      email: 'novo@usuario.com',
      username: `user${usuarios.length + 1}`,
      perfil: 'usuario',
      status: 'ativo',
      telefone: '(11) 99999-9999',
      departamento: 'Operações',
      dataCriacao: new Date().toISOString().split('T')[0],
      ultimoAcesso: new Date().toISOString().split('T')[0]
    }

    const novosUsuarios = [...usuarios, novoUsuario]
    setUsuarios(novosUsuarios)
    
    // Atualizar localStorage mantendo a estrutura original
    const storedUsers = localStorage.getItem('sgm_users')
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers)
        const updatedUsers = [...parsedUsers, novoUsuario]
        localStorage.setItem('sgm_users', JSON.stringify(updatedUsers))
      } catch (error) {
        localStorage.setItem('sgm_users', JSON.stringify(novosUsuarios))
      }
    } else {
      localStorage.setItem('sgm_users', JSON.stringify(novosUsuarios))
    }
  }

  const handleEditUsuario = (usuario) => {
    // Implementar modal de edição no futuro
    console.log('Editar usuário:', usuario)
  }

  const handleDeleteUsuario = (usuario) => {
    setUsuarioToDelete(usuario)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (usuarioToDelete) {
      const novosUsuarios = usuarios.filter(u => u.id !== usuarioToDelete.id)
      setUsuarios(novosUsuarios)
      
      // Atualizar localStorage
      const storedUsers = localStorage.getItem('sgm_users')
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers)
          const updatedUsers = parsedUsers.filter(u => u.id !== usuarioToDelete.id)
          localStorage.setItem('sgm_users', JSON.stringify(updatedUsers))
        } catch (error) {
          localStorage.setItem('sgm_users', JSON.stringify(novosUsuarios))
        }
      }
    }
    setShowDeleteModal(false)
    setUsuarioToDelete(null)
  }

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === 'ativo').length,
    inativos: usuarios.filter(u => u.status === 'inativo').length,
    administradores: usuarios.filter(u => u.perfil === 'administrador').length,
    ultimoMes: usuarios.filter(u => {
      const ultimoAcesso = new Date(u.ultimoAcesso)
      const umMesAtras = new Date()
      umMesAtras.setMonth(umMesAtras.getMonth() - 1)
      return ultimoAcesso >= umMesAtras
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Usuários
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de usuários do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Controle de Acesso
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Perfis e Permissões
          </Badge>
          <Button onClick={handleCreateUsuario} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              usuários cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">
              usuários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
            <p className="text-xs text-muted-foreground">
              usuários inativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Key className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.administradores}</div>
            <p className="text-xs text-muted-foreground">
              com acesso total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos (30d)</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.ultimoMes}</div>
            <p className="text-xs text-muted-foreground">
              último mês
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
                  placeholder="Pesquisar usuários..."
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
            {filteredUsuarios.length} usuários encontrados
          </div>

          {filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Ajuste os filtros de pesquisa ou cadastre um novo usuário
              </p>
              <Button onClick={handleCreateUsuario} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Usuário
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => {
                    const StatusIcon = statusConfig[usuario.status]?.icon || CheckCircle
                    const PerfilIcon = perfilConfig[usuario.perfil]?.icon || Users
                    
                    return (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {usuario.nome?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{usuario.nome}</div>
                              <div className="text-sm text-muted-foreground">@{usuario.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {usuario.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              perfilConfig[usuario.perfil]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <PerfilIcon className="h-3 w-3" />
                            {perfilConfig[usuario.perfil]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{usuario.departamento}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              statusConfig[usuario.status]?.color,
                              "flex items-center gap-1 w-fit"
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[usuario.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(usuario.ultimoAcesso)}
                        </TableCell>
                        <TableCell>
                          {formatDate(usuario.dataCriacao)}
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
                              <DropdownMenuItem onClick={() => handleEditUsuario(usuario)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="mr-2 h-4 w-4" />
                                Redefinir Senha
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUsuario(usuario)}
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
              <Shield className="h-5 w-5 text-blue-600" />
              Controle de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema completo de controle de acesso com diferentes níveis de permissão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Perfis e Permissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestão de perfis de usuário com permissões específicas por módulo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Auditoria e Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registro completo de atividades e auditoria de acesso dos usuários
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
              Tem certeza que deseja excluir o usuário "{usuarioToDelete?.nome}"? 
              Esta ação não pode ser desfeita e o usuário perderá o acesso ao sistema.
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

export default UsuariosGerenciamento

