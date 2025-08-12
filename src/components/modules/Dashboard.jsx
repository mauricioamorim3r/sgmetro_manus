import React from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  MapPin,
  Building,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, animations, effects } from '@/lib/utils'

export function Dashboard() {
  const stats = [
    {
      title: 'Total de Equipamentos',
      value: '0',
      change: '0%',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Medições Ativas',
      value: '0',
      change: '0%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Alertas Pendentes',
      value: '0',
      change: '0%',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Conformidade',
      value: '0%',
      change: '0%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  const recentActivities = []

  const operationalSummary = [
    { label: 'Equipamentos Ativos', value: 0 },
    { label: 'Medições Hoje', value: 0 },
    { label: 'Taxa de Conformidade', value: '0%' }
  ]

  const areaBreakdown = [
    { name: 'Polos Operacionais', value: 0, color: 'bg-blue-500' },
    { name: 'Instalações', value: 0, color: 'bg-green-500' },
    { name: 'Pontos de Medição', value: 0, color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard SGM</h1>
        <p className="text-muted-foreground">
          Sistema de Gerenciamento Metrológico - Visão Geral
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={cn(
              "transition-all duration-200",
              animations.hoverLift,
              effects.shadow.sm
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.bgColor
                )}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={cn(
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'
                  )}>
                    {stat.change}
                  </span>
                  {' '}em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade registrada</p>
                <p className="text-sm">As atividades aparecerão aqui conforme você usar o sistema</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operational Summary */}
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Resumo Operacional
            </CardTitle>
            <CardDescription>
              Indicadores principais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operationalSummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">{item.label}</span>
                <Badge variant="outline" className="font-mono">
                  {item.value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Areas de Atuação */}
      <Card className={cn(animations.slideUp, effects.shadow.sm)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Áreas de Atuação
          </CardTitle>
          <CardDescription>
            Distribuição por categoria operacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {areaBreakdown.map((area, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/30">
                <div className={cn(
                  "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                  area.color
                )}>
                  {index === 0 && <MapPin className="h-6 w-6 text-white" />}
                  {index === 1 && <Building className="h-6 w-6 text-white" />}
                  {index === 2 && <Target className="h-6 w-6 text-white" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{area.name}</h3>
                <p className="text-2xl font-bold text-foreground">{area.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

