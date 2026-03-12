import React from 'react';
import { useData } from '../context/DataContext';
import { Home, CheckSquare, Heart, Target, Gift, Calendar, TrendingUp, Trophy, Flame, User, Award, Brain, Sword, X, Bell } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'tasks', name: 'Tareas', icon: CheckSquare },
  { id: 'habits', name: 'Hábitos', icon: Heart },
  { id: 'lifeAreas', name: 'Áreas de Vida', icon: Target },
  { id: 'rewards', name: 'Recompensas', icon: Gift },
  { id: 'calendar', name: 'Calendario', icon: Calendar },
  { id: 'achievements', name: 'Logros', icon: Award },
  { id: 'analytics', name: 'Análisis', icon: Brain },
  { id: 'bossBattles', name: 'Boss Battles', icon: Sword },
  { id: 'notifications', name: 'Notificaciones', icon: Bell },
  { id: 'profile', name: 'Perfil', icon: User },
];

function Sidebar({ activeSection, setActiveSection, gameData, isOpen, setIsOpen }) {
  const { user } = gameData;
  const { themes, gameData: ctxData } = useData();
  const unreadCount = (ctxData.notificationHistory || []).filter(n => !n.read).length;
  
  const currentTheme = user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;

  // Calcular progreso semanal (simulado)
  const weekProgress = [
    { day: 'Lun', completed: true },
    { day: 'Mar', completed: true },
    { day: 'Mié', completed: false },
    { day: 'Jue', completed: true },
    { day: 'Vie', completed: false },
    { day: 'Sáb', completed: false },
    { day: 'Dom', completed: false },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 flex-shrink-0 ${themeConfig.card} border-r ${themeConfig.border} p-5 flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 md:z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
      `}>
      {/* Logo y Título */}
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-600/10 rounded-xl flex items-center justify-center border border-brand-600/20">
            <Trophy className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight ${themeConfig.text}`}>Gamify Life</h1>
            <p className={`${themeConfig.textMuted} text-xs font-medium`}>Tu épico viaje</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors hidden md:block`}
          title="Ocultar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stats del Usuario - Clean */}
      <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/50 border ${themeConfig.border} shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`${themeConfig.textMuted} text-xs font-semibold uppercase tracking-wider`}>Nivel {user.level}</span>
          <span className="text-brand-600 font-bold text-xs bg-brand-50 px-2 py-1 rounded-md">{user.xp} XP</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className="bg-brand-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(user.xp % (user.level * 100)) / (user.level * 100) * 100}%` }}
          />
        </div>
        {/* HP Bar */}
        {(() => {
          const hp = user.hp ?? 100;
          const maxHp = user.maxHp ?? 100;
          const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
          const hpColor = pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#22c55e';
          return (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span style={{ fontSize: 11, color: hpColor, fontWeight: 700, animation: pct < 30 ? 'pulse 1s infinite' : 'none' }}>❤️</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: hpColor, borderRadius: 999, transition: 'width 0.5s, background 0.5s' }} />
                </div>
                <span style={{ fontSize: 10, color: hpColor, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{hp}/{maxHp}</span>
              </div>
              {user.isDead && <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textAlign: 'center' }}>💀 ¡MUERTO! Ve a Recompensas</div>}
            </div>
          );
        })()}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500/80" />
            <span className={`${themeConfig.text} text-sm font-semibold`}>{user.streak} d</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-500/80 text-sm">💰</span>
            <span className={`${themeConfig.text} text-sm font-semibold`}>{user.coins}</span>
          </div>
        </div>
      </div>

      {/* Small Habits Summary */}
      <div className={`mb-4 p-3 rounded-xl border ${themeConfig.border} bg-white/50`}> 
        <div className="flex items-center justify-between mb-2">
          <span className={`${themeConfig.textMuted} text-xs font-semibold`}>Hábitos</span>
          <span className="text-xs font-bold text-gray-700">{(ctxData.habits || []).length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Completados hoy</span>
          <span className="text-sm font-semibold text-green-600">{(ctxData.habits || []).filter(h => h.completedToday).length}</span>
        </div>
      </div>


      {/* Navegación Principal */}
      <nav className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        <div className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  // Opcional: auto-cerrar en móvil
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-brand-50/80 text-brand-700 font-medium' 
                    : `text-gray-600 hover:bg-gray-50 hover:text-gray-900`
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm flex-1 text-left">
                  {item.name}
                </span>
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Atajos de Teclado - Minimalista */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Atajos</div>
        <div className="flex gap-2 text-[10px] text-gray-400 font-mono">
          <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">^N</span>
          <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">^H</span>
          <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">^R</span>
        </div>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
