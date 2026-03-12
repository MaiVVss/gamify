import React from 'react';
import { useData } from '../context/DataContext';
import { Home, CheckSquare, Heart, User, Menu, Bell } from 'lucide-react';

function BottomNav({ activeSection, setActiveSection, setIsSidebarOpen }) {
  const { gameData, themes } = useData();
  
  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  const unreadCount = (gameData.notificationHistory || []).filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Inicio' },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas' },
    { id: 'habits', icon: Heart, label: 'Hábitos' },
    { id: 'notifications', icon: Bell, label: 'Alertas', badge: unreadCount },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className={`
      md:hidden fixed bottom-0 left-0 right-0 z-40
      ${themeConfig.card} border-t ${themeConfig.border}
      bg-opacity-90 backdrop-blur-md pb-safe
    `}>
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false); // Ensurance Sidebar is closed
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive 
                  ? 'text-brand-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`
                relative flex items-center justify-center w-auto h-8 px-3 rounded-full transition-all duration-200
                ${isActive ? 'bg-brand-100/50' : 'bg-transparent'}
              `}>
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold text-brand-700' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Helper to open right-sided / Full Menu Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[64px] text-gray-400 hover:text-gray-600"
        >
          <div className="flex items-center justify-center w-auto h-8 px-4 rounded-full bg-transparent">
            <Menu className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Menú</span>
        </button>
      </div>
    </div>
  );
}

export default BottomNav;
