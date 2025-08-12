import React from 'react'
import { Bell, Search, Settings, User, LogOut, Menu, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, animations, effects } from '@/lib/utils'

export function Header({ user, onLogout, onToggleSidebar, className }) {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: 'info',
      title: 'Bem-vindo ao SGM',
      message: 'Sistema iniciado com sucesso',
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Calibração Pendente',
      message: 'Equipamento EQ-001 precisa de calibração',
      time: '1 hora atrás',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Concluído',
      message: 'Backup dos dados realizado com sucesso',
      time: '3 horas atrás',
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPerfilDisplay = (perfil) => {
    const perfis = {
      'usuario': 'Usuário',
      'operador': 'Operador',
      'supervisor': 'Supervisor',
      'administrador': 'Administrador',
      'gerente': 'Gerente'
    }
    return perfis[perfil] || 'Usuário'
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60",
      effects.shadow.corporate,
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className={cn(
              "lg:hidden",
              animations.hoverLift
            )}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              effects.gradientPrimary,
              animations.scaleIn
            )}>
              <span className="text-lg font-bold text-primary-foreground">SGM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">
                Sistema de Gerenciamento Metrológico
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestão Inteligente de Equipamentos e Medições
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Central */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar equipamentos, instalações..."
              className={cn(
                "pl-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20",
                animations.hoverLift
              )}
            />
          </div>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-2">
          {/* Botão de Pesquisa Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className={cn("md:hidden", animations.hoverLift)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notificações */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("relative", animations.hoverLift)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className={cn(
                      "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs",
                      animations.scaleIn
                    )}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Notificações</h4>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        notification.read 
                          ? "bg-muted/30 border-muted" 
                          : "bg-background border-border hover:bg-muted/50"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Configurações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("hidden sm:flex", animations.hoverLift)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4" align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={animations.hoverLift}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações Gerais</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={animations.hoverLift}>
                <User className="mr-2 h-4 w-4" />
                <span>Preferências do Usuário</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={animations.hoverLift}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Configurar Notificações</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "relative h-10 w-10 rounded-full",
                  animations.hoverLift
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className={cn(
                    "bg-primary text-primary-foreground font-semibold",
                    effects.gradientPrimary
                  )}>
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={cn(
                "w-56 mr-4",
                animations.slideUp,
                effects.shadow.lg
              )} 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.nome || user?.username || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'usuario@sgm.com'}
                  </p>
                  <Badge variant="outline" className="w-fit mt-1">
                    {getPerfilDisplay(user?.perfil)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={animations.hoverLift}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={animations.hoverLift}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn(
                  "text-destructive focus:text-destructive",
                  animations.hoverLift
                )}
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Bar Melhorado */}
      <div className={cn(
        "border-t bg-muted/30 px-4 py-2",
        effects.glass
      )}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Sistema Operacional</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Usuário: {getPerfilDisplay(user?.perfil)}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span>Módulos: 17 disponíveis</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
            <Badge variant="outline" className="text-xs">
              SGM v2.0
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}

