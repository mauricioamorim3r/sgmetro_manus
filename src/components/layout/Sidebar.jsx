import React from 'react'
import { 
  LayoutDashboard, 
  MapPin, 
  Building, 
  Target, 
  Circle, 
  TrendingUp, 
  Ruler, 
  TestTube, 
  FlaskConical, 
  Wrench, 
  ArrowRightLeft, 
  Package, 
  RotateCcw,
  Settings,
  SettingsIcon,
  Users,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, animations, effects } from '@/lib/utils'

const modules = [
  {
    category: 'VISÃO GERAL',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' }
    ]
  },
  {
    category: 'ESTRUTURA',
    items: [
      { id: 'polos', name: 'Polos', icon: MapPin, color: 'text-orange-600' },
      { id: 'instalacoes', name: 'Instalações', icon: Building, color: 'text-purple-600' },
      { id: 'pontos-medicao', name: 'Pontos de Medição', icon: Target, color: 'text-teal-600' }
    ]
  },
  {
    category: 'MEDIÇÃO',
    items: [
      { id: 'placas-orificio', name: 'Placas de Orifício', icon: Circle, color: 'text-pink-600' },
      { id: 'incertezas', name: 'Incertezas', icon: TrendingUp, color: 'text-indigo-600' },
      { id: 'trechos-retos', name: 'Trechos Retos', icon: Ruler, color: 'text-amber-600' }
    ]
  },
  {
    category: 'OPERAÇÕES',
    items: [
      { id: 'testes-pocos', name: 'Testes de Poços', icon: TestTube, color: 'text-green-600', badge: 'BTP' },
      { id: 'analises-quimicas', name: 'Análises Químicas', icon: FlaskConical, color: 'text-red-600', badge: 'FQ' }
    ]
  },
  {
    category: 'GESTÃO',
    items: [
      { id: 'gestao-equipamentos', name: 'Gestão de Equipamentos', icon: Wrench, color: 'text-slate-600' },
      { id: 'movimentacao-equipamentos', name: 'Movimentação de Equipamentos', icon: ArrowRightLeft, color: 'text-rose-600' },
      { id: 'estoque', name: 'Estoque', icon: Package, color: 'text-lime-600' },
      { id: 'movimentacao', name: 'Movimentação', icon: RotateCcw, color: 'text-cyan-600' }
    ]
  },
  {
    category: 'SISTEMA',
    items: [
      { id: 'usuarios', name: 'Usuários', icon: Users, color: 'text-violet-600' },
      { id: 'configuracoes', name: 'Configurações', icon: Settings, color: 'text-gray-600' },
      { id: 'configuracoes-avancadas', name: 'Configurações Avançadas', icon: SettingsIcon, color: 'text-stone-600' }
    ]
  }
]

export function Sidebar({ 
  activeModule, 
  onModuleChange, 
  collapsed, 
  onClose, 
  className 
}) {
  return (
    <aside className={cn(
      "flex flex-col bg-card border-r h-full",
      collapsed ? "w-16" : "w-64",
      "transition-all duration-300 ease-in-out",
      effects.shadow.sm,
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        collapsed && "justify-center"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              effects.gradientPrimary
            )}>
              <span className="text-sm font-bold text-primary-foreground">SGM</span>
            </div>
            <span className="font-semibold text-foreground">Sistema SGM</span>
          </div>
        )}
        
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-6">
          {modules.map((category) => (
            <div key={category.category}>
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category.category}
                </h3>
              )}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeModule === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        collapsed ? "px-2" : "px-3",
                        isActive && [
                          "bg-primary/10 text-primary border-primary/20",
                          effects.shadow.sm
                        ],
                        !isActive && "hover:bg-muted/50",
                        animations.hoverLift
                      )}
                      onClick={() => onModuleChange(item.id)}
                    >
                      <Icon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-primary" : item.color
                      )} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground",
                              isActive && "bg-primary/20 text-primary"
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}

