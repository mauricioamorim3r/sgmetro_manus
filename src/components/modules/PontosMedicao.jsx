import React, { useState } from 'react'
import { Target, Plus, Search, Filter, Edit, Trash2, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, animations, effects } from '@/lib/utils'

export function PontosMedicao() {
  const [pontos, setPontos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPontos = pontos.filter(ponto =>
    ponto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ponto.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-teal-600" />
            Pontos de Medição
          </h1>
          <p className="text-muted-foreground">
            Controle e monitoramento dos pontos de medição
          </p>
        </div>
        <Button className={cn(animations.hoverLift)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ponto de Medição
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pontos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Target className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Manutenção</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className={cn(effects.shadow.sm)}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pontos de medição..."
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
      {filteredPontos.length === 0 ? (
        <Card className={cn(animations.slideUp, effects.shadow.sm)}>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum ponto de medição cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Comece cadastrando seu primeiro ponto de medição no sistema
              </p>
              <Button className={cn(animations.hoverLift)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Ponto
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPontos.map((ponto, index) => (
            <Card key={index} className={cn(
              "transition-all duration-200",
              animations.hoverLift,
              effects.shadow.sm
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ponto.nome}</CardTitle>
                  <Badge variant={
                    ponto.status === 'ativo' ? 'default' :
                    ponto.status === 'manutencao' ? 'secondary' : 'destructive'
                  }>
                    {ponto.status}
                  </Badge>
                </div>
                <CardDescription>{ponto.codigo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Instalação:</span> {ponto.instalacao}</p>
                  <p><span className="font-medium">Tipo:</span> {ponto.tipo}</p>
                  <p><span className="font-medium">Última Medição:</span> {ponto.ultimaMedicao}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className={cn(animations.hoverLift)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className={cn(animations.hoverLift)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

