import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle, UserPlus, LogIn } from 'lucide-react'

const LoginForm = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nome: '',
    email: '',
    perfil: 'usuario'
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  
  const { login, loading, error } = useAuth()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      return
    }

    const result = await login(formData.username, formData.password)
    if (result && result.success) {
      navigate('/')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError('')
    setRegisterSuccess('')

    // Validações mais robustas
    if (!formData.username || !formData.password || !formData.nome || !formData.email || !formData.perfil) {
      setRegisterError('Todos os campos são obrigatórios')
      setRegisterLoading(false)
      return
    }

    if (formData.username.length < 3) {
      setRegisterError('O nome de usuário deve ter pelo menos 3 caracteres')
      setRegisterLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('As senhas não coincidem')
      setRegisterLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres')
      setRegisterLoading(false)
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setRegisterError('Por favor, insira um e-mail válido')
      setRegisterLoading(false)
      return
    }

    // Verificar se usuário já existe no localStorage
    const existingUsers = JSON.parse(localStorage.getItem('sgm_users') || '[]')
    const userExists = existingUsers.find(user => 
      user.username === formData.username || user.email === formData.email
    )

    if (userExists) {
      setRegisterError('Usuário ou e-mail já cadastrado')
      setRegisterLoading(false)
      return
    }

    try {
      // Tentar cadastro no backend primeiro
      const response = await fetch('https://3dhkilcevmgg.manus.space/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          nome: formData.nome,
          email: formData.email,
          perfil: formData.perfil
        }),
        credentials: 'omit'
      })

      if (response.ok) {
        // Cadastro no backend bem-sucedido
        setRegisterSuccess('Usuário cadastrado com sucesso! Faça login para continuar.')
        setIsLogin(true)
        setFormData({
          username: formData.username,
          password: '',
          confirmPassword: '',
          nome: '',
          email: '',
          perfil: 'usuario'
        })
      } else {
        throw new Error('Backend indisponível')
      }
    } catch (error) {
      console.log('Backend indisponível, usando sistema local:', error)
      
      // Fallback: Cadastro local usando localStorage
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password, // Em produção, seria hash
        nome: formData.nome,
        email: formData.email,
        perfil: formData.perfil,
        createdAt: new Date().toISOString()
      }

      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem('sgm_users', JSON.stringify(updatedUsers))
      localStorage.setItem('sgm_local_mode', 'true')

      setRegisterSuccess('Usuário cadastrado localmente com sucesso! Faça login para continuar.')
      setIsLogin(true)
      setFormData({
        username: formData.username,
        password: '',
        confirmPassword: '',
        nome: '',
        email: '',
        perfil: 'usuario'
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setRegisterError('')
    setRegisterSuccess('')
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      nome: '',
      email: '',
      perfil: 'usuario'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">SGM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            SGM - {isLogin ? 'Login' : 'Cadastro'}
          </h1>
          <p className="text-gray-600 mt-1">Sistema de Gerenciamento Metrológico</p>
        </div>

        {/* Formulário */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Digite suas credenciais para acessar o SGM'
                : 'Preencha os dados para criar sua conta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              
              {/* Campos de Cadastro */}
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={handleInputChange}
                      disabled={registerLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={registerLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil/Função</Label>
                    <Select 
                      value={formData.perfil} 
                      onValueChange={(value) => setFormData({...formData, perfil: value})}
                      disabled={registerLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usuario">Usuário</SelectItem>
                        <SelectItem value="operador">Operador</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Campos Comuns */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading || registerLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading || registerLoading}
                  required
                />
              </div>

              {/* Confirmar Senha (apenas no cadastro) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={registerLoading}
                    required
                  />
                </div>
              )}

              {/* Mensagens de Erro/Sucesso */}
              {(error || registerError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || registerError}
                  </AlertDescription>
                </Alert>
              )}

              {registerSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {registerSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {/* Botão Principal */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={
                  (loading || registerLoading) || 
                  (!formData.username || !formData.password) ||
                  (!isLogin && (!formData.nome || !formData.email || !formData.confirmPassword || !formData.perfil))
                }
              >
                {(loading || registerLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Entrando...' : 'Cadastrando...'}
                  </>
                ) : (
                  <>
                    {isLogin ? (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastrar
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle entre Login/Cadastro */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button 
                variant="outline" 
                onClick={toggleMode}
                disabled={loading || registerLoading}
                className="w-full"
              >
                {isLogin ? (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Nova Conta
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Fazer Login
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          © 2025 SGM - Sistema de Gerenciamento Metrológico
        </div>
      </div>
    </div>
  )
}

export { LoginForm }

