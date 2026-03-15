import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { Menu, LogOut, Cloud, CloudOff } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Habits from './components/Habits';
import Rewards from './components/Rewards';
import LifeAreas from './components/LifeAreas';
import Calendar from './components/Calendar';
import Profile from './components/Profile';
import Achievements from './components/Achievements';
import Analytics from './components/Analytics';
import BossBattles from './components/BossBattles';
import NotificationSystem from './components/NotificationSystem';
import NotificationsPage from './components/NotificationsPage';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import './App.css';

function AppContent() {
  const { gameData, updateGameData, addNotification, notifications, dismissNotification, themes } = useData();
  const { user: authUser, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-accent', gameData.user?.accentColor || 'purple');
  }, [currentTheme, gameData.user?.accentColor]);
  
  // Verificar streak diario
  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = new Date(gameData.user.lastActiveDate).toDateString();
    
    if (today !== lastActive) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        updateGameData({
          user: {
            ...gameData.user,
            streak: gameData.user.streak + 1,
            lastActiveDate: new Date().toISOString()
          }
        });
        if (gameData.user.streak > 0) {
          addNotification(`🔥 ¡Mantienes tu racha de ${gameData.user.streak + 1} días!`, 'success');
        }
      } else {
        updateGameData({
          user: {
            ...gameData.user,
            streak: 0,
            lastActiveDate: new Date().toISOString()
          }
        });
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'n': e.preventDefault(); setActiveSection('tasks'); break;
          case 'h': e.preventDefault(); setActiveSection('habits'); break;
          case 'r': e.preventDefault(); setActiveSection('rewards'); break;
          case 't': e.preventDefault(); setActiveSection('calendar'); break;
          case 'p': e.preventDefault(); setActiveSection('profile'); break;
          default: break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':    return <Dashboard addNotification={addNotification} setActiveSection={setActiveSection} />;
      case 'tasks':        return <Tasks addNotification={addNotification} />;
      case 'habits':       return <Habits addNotification={addNotification} />;
      case 'rewards':
      case 'rewards-user':
      case 'rewards-inventory':
        return <Rewards addNotification={addNotification} activeTabHint={activeSection} />;
      case 'lifeAreas':    return <LifeAreas addNotification={addNotification} />;
      case 'calendar':     return <Calendar addNotification={addNotification} />;
      case 'achievements': return <Achievements addNotification={addNotification} />;
      case 'analytics':    return <Analytics addNotification={addNotification} />;
      case 'bossBattles':  return <BossBattles addNotification={addNotification} />;
      case 'notifications':return <NotificationsPage />;
      case 'profile':      return <Profile addNotification={addNotification} />;
      default:             return <Dashboard addNotification={addNotification} setActiveSection={setActiveSection} />;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addNotification('👋 ¡Hasta pronto! Sesión cerrada.', 'info');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${themeConfig.bg}`}>
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        gameData={gameData}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className={`flex-1 overflow-y-auto ${themeConfig.bg} transition-all duration-300 pb-20 md:pb-0`}>
        <div className={`sticky top-0 z-10 p-0 md:h-0 flex items-center bg-transparent pointer-events-none`}>
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`hidden md:flex pointer-events-auto p-2 rounded-xl border ${themeConfig.border} ${themeConfig.card} ${themeConfig.text} hover:bg-gray-100/50 backdrop-blur-sm shadow-sm transition-all items-center gap-2 mt-6 ml-6`}
              title="Mostrar menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User account bar */}
        {authUser && (
          <div className="flex items-center justify-end gap-3 px-4 pt-3 md:px-6 md:pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Cloud style={{ width: 14, height: 14, color: '#22c55e' }} />
              <span className="hidden sm:inline">Sync activo — {authUser.email}</span>
              <span className="sm:hidden">{authUser.displayName?.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut style={{ width: 13, height: 13 }} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}

        <div className="p-4 pt-2 md:p-6 md:pt-2 max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
      
      <BottomNav 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}

// ── Auth Gate: shows Login if not authenticated ──────────────────────────────
function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, animation: 'pulse 1.5s ease-in-out infinite'
        }}>⚔️</div>
        <div style={{ color: '#a78bfa', fontSize: 14 }}>Cargando tu aventura...</div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <DataProvider authUser={user}>
      <AppContent />
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
