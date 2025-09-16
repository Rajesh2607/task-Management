import React from 'react';
import { LayoutGrid, CheckSquare, Users, MessageSquare, Settings, X, Menu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
  onMenuToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onClose }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'message', label: 'Message', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose?.(); // Close sidebar on mobile after selection
  };

  return (
    <div className={`${activeTab === 'task' ? 'w-80 lg:w-80' : 'w-64 lg:w-64'} bg-white h-screen border-r border-gray-100 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-gray-100">
               <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/book-square.jpg" 
              alt="DNX Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.style.display = 'block';
              }}
            />
            <span className="text-white font-bold text-sm" style={{display: 'none'}}>D</span>
          </div>
          <span className="text-xl font-bold text-gray-900">DNX</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
