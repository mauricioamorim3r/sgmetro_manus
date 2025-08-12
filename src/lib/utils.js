import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Função para formatação de datas
export function formatDate(date) {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return '-'
  }
}

// Função para formatação de data e hora
export function formatDateTime(date) {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '-'
  }
}

// Cores para status
export const statusColors = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-red-100 text-red-800 border-red-200',
  manutencao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  planejado: 'bg-blue-100 text-blue-800 border-blue-200',
  suspenso: 'bg-gray-100 text-gray-800 border-gray-200'
}

// Animações reutilizáveis
export const animations = {
  fadeIn: "animate-in fade-in duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  slideLeft: "animate-in slide-in-from-right-4 duration-300",
  slideRight: "animate-in slide-in-from-left-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  hoverLift: "transition-all duration-200 hover:scale-105 hover:shadow-md",
  hoverGlow: "transition-all duration-200 hover:shadow-lg hover:shadow-primary/25",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin"
}

// Efeitos visuais reutilizáveis
export const effects = {
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md", 
    lg: "shadow-lg",
    xl: "shadow-xl",
    corporate: "shadow-lg shadow-black/10"
  },
  gradient: {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700",
    success: "bg-gradient-to-r from-green-600 to-green-700",
    warning: "bg-gradient-to-r from-yellow-600 to-yellow-700",
    danger: "bg-gradient-to-r from-red-600 to-red-700"
  },
  gradientPrimary: "bg-gradient-to-r from-blue-600 to-blue-700",
  glass: "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
  border: {
    primary: "border-primary/20",
    secondary: "border-secondary/20",
    muted: "border-muted"
  }
}
