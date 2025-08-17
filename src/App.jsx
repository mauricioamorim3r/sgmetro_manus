import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import { LoginForm } from './components/auth/LoginForm'

// Módulos
import { Dashboard } from './components/modules/Dashboard'
import { Polos } from './components/modules/Polos'
import { Instalacoes } from './components/modules/Instalacoes'
import { PontosMedicao } from './components/modules/PontosMedicao'
import PlacasOrificio from './components/modules/PlacasOrificio'
import { Incertezas } from './components/modules/Incertezas'
import { TrechosRetos } from './components/modules/TrechosRetos'
import { TestesPocos } from './components/modules/TestesPocos'
import { AnalisesQuimicas } from './components/modules/AnalisesQuimicas'
import GestaoEquipamentos from './components/modules/GestaoEquipamentos'
import MovimentacaoEquipamentos from './components/modules/MovimentacaoEquipamentos'
import { Estoque } from './components/modules/Estoque'
import MovimentacaoGeral from './components/modules/MovimentacaoGeral'
import UsuariosGerenciamento from './components/modules/UsuariosGerenciamento'

import './App.css'

// Componente para módulos não implementados
function ModuloEmDesenvolvimento({ titulo, descricao }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{titulo}</h1>
        <p className="text-muted-foreground">{descricao}</p>
      </div>
      <div className="bg-card border rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold mb-2">Módulo em Desenvolvimento</h3>
        <p className="text-muted-foreground">
          Este módulo está sendo desenvolvido e estará disponível em breve.
        </p>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, logout } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'polos':
        return <Polos />
      case 'instalacoes':
        return <Instalacoes />
      case 'pontos-medicao':
        return <PontosMedicao />
      case 'placas-orificio':
        return <PlacasOrificio />
      case 'incertezas':
        return <Incertezas />
      case 'trechos-retos':
        return <TrechosRetos />
      case 'testes-pocos':
        return <TestesPocos />
      case 'analises-quimicas':
        return <AnalisesQuimicas />
      case 'gestao-equipamentos':
        return <GestaoEquipamentos />
      case 'movimentacao-equipamentos':
        return <MovimentacaoEquipamentos />
      case 'estoque':
        return <Estoque />
      case 'movimentacao':
        return <MovimentacaoGeral />
      case 'usuarios':
        return <UsuariosGerenciamento />
      case 'configuracoes':
        return <ModuloEmDesenvolvimento 
          titulo="Configurações" 
          descricao="Configurações gerais do sistema" 
        />
      case 'configuracoes-avancadas':
        return <ModuloEmDesenvolvimento 
          titulo="Configurações Avançadas" 
          descricao="Configurações avançadas do sistema" 
        />
      default:
        return <Dashboard />
    }
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <Layout
      user={user}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      onLogout={logout}
    >
      {renderModule()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
