import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn, animations, effects } from '@/lib/utils'

function Layout({ 
  children, 
  user, 
  activeModule, 
  onModuleChange, 
  onLogout,
  className 
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={cn(
      "min-h-screen bg-background",
      className
    )}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar
          activeModule={activeModule}
          onModuleChange={(module) => {
            onModuleChange(module)
            closeMobileSidebar()
          }}
          collapsed={sidebarCollapsed}
          onClose={closeMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Header */}
        <Header
          user={user}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className={cn(
          "flex-1 p-6",
          animations.fadeIn
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}

export { Layout }

