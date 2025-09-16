import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Overview from './components/Overview'
import ExploreTask from './components/ExploreTask'
import DetailTask from './components/DetailTask'
import Settings from './components/Settings'
import HelpCenter from './components/HelpCenter'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentView, setCurrentView] = useState<'explore' | 'detail'>('explore')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setCurrentView('detail')
    setActiveTab('task') // Switch to task tab when clicking from overview
  }

  const handleBackToExplore = () => {
    setCurrentView('explore')
    setSelectedTaskId(null)
  }

  const renderContent = () => {
    if (activeTab === 'overview') {
      return <Overview onTaskClick={handleTaskClick} onMenuToggle={() => setSidebarOpen(true)} />
    }
    
    if (activeTab === 'task') {
      return currentView === 'explore' ? (
        <ExploreTask onTaskClick={handleTaskClick} onMenuToggle={() => setSidebarOpen(true)} />
      ) : (
        <DetailTask taskId={selectedTaskId} onBack={handleBackToExplore} />
      )
    }
    
    if (activeTab === 'settings') {
      return <Settings />
    }
    
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <p className="text-gray-600">This section is under development</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 z-50 h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>

      <div className="hidden lg:block">
        <HelpCenter />
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        }}
      />
    </div>
  )
}

export default App
