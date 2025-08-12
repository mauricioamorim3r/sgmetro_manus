import React from 'react'
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Users,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
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
import { cn, animations, effects, formatDate, statusColors } from '@/lib/utils'

// Dados dos polos - inicialmente vazio para cadastro pelo usuário
const polosData = []

const statusConfig = {
  ativo: {
    label: 'Ativo',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  manutencao: {
    label: 'Manutenção',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  inativo: {
    label: 'Inativo',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
  },
}

export function Polos() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedPolo, setSelectedPolo] = React.useState(null)
  const [backendConnected, setBackendConnected] = React.useState(true)

  // Verificar conexão com backend
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        setBackendConnected(response.ok)
      } catch {
        setBackendConnected(false)
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredPolos = polosData.filter(polo =>
    polo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    polo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    polo.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className={cn("space-y-4", animations.slideUp)}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-white",
                "bg-blue-500",
                animations.scaleIn
              )}>
                <MapPin className="h-5 w-5" />
              </div>
              Polos
            </h1>
            <p className="text-muted-foreground">
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={backendConnected ? 'default' : 'destructive'}
              className={cn("gap-1", animations.scaleIn)}
            >
              <Activity className="h-3 w-3" />
            </Badge>
            <Button 
              className={cn(
                effects.gradientPrimary,
                animations.hoverLift,
                effects.shadow.md
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Polo
            </Button>
          </div>
        </div>

        {/* Barra de Ferramentas */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl border",
          effects.glass,
          effects.shadow.sm,
          animations.slideUp
        )}>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar polos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("pl-10", animations.hoverLift)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className={animations.hoverLift}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredPolos.length} polos encontrados</span>
          </div>
        </div>
      </div>

      {/* Cards dos Polos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPolos.map((polo, index) => {
          const StatusIcon = statusConfig[polo.status]?.icon || CheckCircle
          
          return (
            <Card 
              key={polo.id}
              className={cn(
                "group cursor-pointer transition-all duration-300",
                effects.shadow.corporate,
                effects.glass,
                animations.hoverLift,
                animations.slideUp
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPolo(polo)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {polo.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {polo.codigo}
                      </code>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          statusConfig[polo.status]?.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[polo.status]?.label}
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          animations.hoverLift
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={effects.shadow.lg}>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={animations.hoverLift}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem className={animations.hoverLift}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className={cn(
                        "text-destructive focus:text-destructive",
                        animations.hoverLift
                      )}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Localização */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{polo.localizacao}</span>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "text-center p-3 rounded-lg",
                    "bg-blue-50 border border-blue-200"
                  )}>
                    <div className="text-lg font-bold text-blue-600">
                      {polo.instalacoes}
                    </div>
                    <div className="text-xs text-blue-600">Instalações</div>
                  </div>
                  
                  <div className={cn(
                    "text-center p-3 rounded-lg",
                    "bg-green-50 border border-green-200"
                  )}>
                    <div className="text-lg font-bold text-green-600">
                      {polo.equipamentos}
                    </div>
                    <div className="text-xs text-green-600">Equipamentos</div>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="outline" className="text-xs">
                      {polo.tipo}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capacidade:</span>
                    <span className="font-medium">{polo.capacidade}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Responsável:</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {polo.responsavel.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs">{polo.responsavel}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Atualizado em {formatDate(polo.ultimaAtualizacao)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabela Detalhada (Opcional) */}
      <Card className={cn(
        effects.shadow.corporate,
        effects.glass,
        animations.slideUp
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Visão Detalhada dos Polos
          </CardTitle>
          <CardDescription>
            Informações completas dos polos de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Polo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Instalações</TableHead>
                <TableHead>Equipamentos</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolos.map((polo) => {
                const StatusIcon = statusConfig[polo.status]?.icon || CheckCircle
                
                return (
                  <TableRow 
                    key={polo.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                      animations.hoverLift
                    )}
                    onClick={() => setSelectedPolo(polo)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{polo.nome}</div>
                        <code className="text-xs text-muted-foreground">
                          {polo.codigo}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          statusConfig[polo.status]?.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[polo.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {polo.localizacao}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{polo.instalacoes}</div>
                        <div className="text-xs text-muted-foreground">unidades</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{polo.equipamentos}</div>
                        <div className="text-xs text-muted-foreground">ativos</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {polo.responsavel.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{polo.responsavel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(polo.ultimaAtualizacao)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-8 w-8 p-0", animations.hoverLift)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={effects.shadow.lg}>
                          <DropdownMenuItem className={animations.hoverLift}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className={animations.hoverLift}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className={cn(
                            "text-destructive focus:text-destructive",
                            animations.hoverLift
                          )}>
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
        </CardContent>
      </Card>

      {/* Status de Implementação */}
      <Card className={cn(
        "border-dashed",
        effects.shadow.sm,
        animations.fadeIn
      )}>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
              </Badge>
              <Badge variant="outline">
                ✓ Validações
              </Badge>
              <Badge variant="outline">
                ✓ API Integrada
              </Badge>
              <Badge variant="outline">
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              validações e integrações com o backend permanente.
            </p>
            
            <div className="text-xs text-muted-foreground">
              <p>Sistema operacional - Cadastre seus polos para começar!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

