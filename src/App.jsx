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
import { Incertezas } from './components/modules/Incertezas'
import { TrechosRetos } from './components/modules/TrechosRetos'
import { TestesPocos } from './components/modules/TestesPocos'
import { AnalisesQuimicas } from './components/modules/AnalisesQuimicas'
import { Estoque } from './components/modules/Estoque'

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
        return <ModuloEmDesenvolvimento 
          titulo="Placas de Orifício" 
          descricao="Gerenciamento de placas de orifício" 
        />
      case 'incertezas':
        return <Incertezas />
      case 'trechos-retos':
        return <TrechosRetos />
      case 'testes-pocos':
        return <TestesPocos />
      case 'analises-quimicas':
        return <AnalisesQuimicas />
      case 'gestao-equipamentos':
        return <ModuloEmDesenvolvimento 
          titulo="Gestão de Equipamentos" 
          descricao="Controle e gerenciamento de equipamentos" 
        />
      case 'movimentacao-equipamentos':
        return <ModuloEmDesenvolvimento 
          titulo="Movimentação de Equipamentos" 
          descricao="Controle de movimentação de equipamentos" 
        />
      case 'estoque':
        return <Estoque />
      case 'movimentacao':
        return <ModuloEmDesenvolvimento 
          titulo="Movimentação" 
          descricao="Controle de movimentação geral" 
        />
      case 'usuarios':
        return <ModuloEmDesenvolvimento 
          titulo="Usuários" 
          descricao="Gerenciamento de usuários do sistema" 
        />
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
