import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

// URL do backend final corrigido
const API_BASE_URL = 'https://3dhkilcevmgg.manus.space'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar se existe token salvo no localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('sgm_token')
        const userData = localStorage.getItem('sgm_user')
        
        if (token && userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('sgm_token')
        localStorage.removeItem('sgm_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Tentando login...', { username, backend: API_BASE_URL })
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ username, password }),
        credentials: 'omit' // Não enviar cookies
      })

      console.log('Resposta recebida:', response.status, response.statusText)

      if (!response.ok) {
        throw new Error(`Backend indisponível`)
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)

      if (data.token && data.user) {
        // Salvar token e dados do usuário
        localStorage.setItem('sgm_token', data.token)
        localStorage.setItem('sgm_user', JSON.stringify(data.user))
        localStorage.setItem('sgm_local_mode', 'false')
        
        setUser(data.user)
        setError(null)
        
        console.log('Login realizado com sucesso!')
        return { success: true, user: data.user }
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (error) {
      console.log('Backend indisponível, tentando login local:', error)
      
      // Fallback: Autenticação local
      try {
        const localUsers = JSON.parse(localStorage.getItem('sgm_users') || '[]')
        const user = localUsers.find(u => u.username === username && u.password === password)
        
        if (user) {
          // Login local bem-sucedido
          const userData = {
            id: user.id,
            username: user.username,
            nome: user.nome,
            email: user.email,
            perfil: user.perfil || 'usuario'
          }
          
          localStorage.setItem('sgm_token', 'local_token_' + Date.now())
          localStorage.setItem('sgm_user', JSON.stringify(userData))
          localStorage.setItem('sgm_local_mode', 'true')
          
          setUser(userData)
          setError(null)
          
          console.log('Login local realizado com sucesso!')
          return { success: true, user: userData }
        } else {
          throw new Error('Usuário ou senha incorretos')
        }
      } catch (localError) {
        console.error('Erro no login local:', localError)
        setError(localError.message)
        return { success: false, error: localError.message }
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('sgm_token')
    localStorage.removeItem('sgm_user')
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

