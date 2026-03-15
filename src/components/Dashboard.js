import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  CheckCircle,
  Circle,
  Flame,
  Zap,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Heart,
  Gift,
  Coins
} from 'lucide-react';

function Dashboard({ addNotification, setActiveSection }) {
  const { gameData, themes, toggleHabit, toggleTask } = useData();
  
  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;

  // Hábitos para hoy
  const todayHabits = useMemo(() => {
    const today = new Date().getDay();
    const all = gameData.habits || [];
    return all.filter(habit => {
      if (habit.frequency === 'Diario') return true;
      if ((habit.frequency === 'Semanal' || habit.frequency === 'Personalizado') && habit.customDays) {
        return habit.customDays.includes(today);
      }
      return true;
    }).sort((a, b) => {
      if (a.completedToday !== b.completedToday) return a.completedToday ? 1 : -1;
      return b.streak - a.streak;
    }).slice(0, 5); // Show top 5
  }, [gameData.habits]);

  // Tareas pendientes
  const activeTasks = useMemo(() => {
    const all = gameData.tasks || [];
    const incomplete = all.filter(t => !t.completed);
    
    return incomplete.sort((a, b) => {
      const priorityA = (a.urgency === 'urgent' && a.importance === 'important') ? 0 : 
                        (a.priority === 'high' ? 1 : 2);
      const priorityB = (b.urgency === 'urgent' && b.importance === 'important') ? 0 : 
                        (b.priority === 'high' ? 1 : 2);
      
      if (priorityA !== priorityB) return priorityA - priorityB;
      
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }).slice(0, 5);
  }, [gameData.tasks]);

  // Recompensas asequibles
  const affordableRewards = useMemo(() => {
    const all = gameData.rewards || [];
    const coins = gameData.user?.coins || 0;
    // Mostrar recompensas que el usuario pueda pagar, o las más baratas primero
    return all.sort((a, b) => {
      const aAffordable = coins >= a.cost;
      const bAffordable = coins >= b.cost;
      if (aAffordable && !bAffordable) return -1;
      if (!aAffordable && bAffordable) return 1;
      return a.cost - b.cost;
    }).slice(0, 3);
  }, [gameData.rewards, gameData.user?.coins]);

  // Daily Progress Calculation
  const dailyProgress = useMemo(() => {
    if (todayHabits.length === 0) return 0;
    const completedItems = todayHabits.filter(h => h.completedToday).length;
    return Math.round((completedItems / todayHabits.length) * 100);
  }, [todayHabits]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const getPriorityColor = (priority, urgency, importance) => {
    if (urgency === 'urgent' && importance === 'important') return 'text-red-600 bg-red-50 border-red-200';
    switch(priority) {
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const priorityLabel = (task) => {
    if (task.urgency === 'urgent' && task.importance === 'important') return 'Urgente';
    if (task.priority === 'high') return 'Alta';
    if (task.priority === 'medium') return 'Media';
    return 'Baja';
  };

  const currentHp = gameData.user?.hp ?? 100;
  const maxHp = gameData.user?.maxHp ?? 100;
  const isHpLow = currentHp <= 30;

  return (
    <div className={`space-y-6 md:space-y-8 ${themeConfig.text} w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-0`}>
      
      {/* Hero Expansivo: Más inmersivo, abarca el ancho completo de forma elegante */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-[2rem] p-6 sm:p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Decoraciones de Cristal / Luz */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white opacity-10 rounded-full blur-[80px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-10 md:left-20 w-48 h-48 md:w-64 md:h-64 bg-brand-400 opacity-20 rounded-full blur-[60px] transform translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 w-full flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full border-[3px] border-white/30 shadow-2xl overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
               <span className="text-3xl sm:text-4xl md:text-6xl font-black drop-shadow-md pb-1">
                 {gameData.user?.name ? gameData.user.name.charAt(0).toUpperCase() : <Zap className="w-12 h-12 text-yellow-400 opacity-50" />}
               </span>
            </div>
            {/* Medallita de nivel sobre el avatar */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-black text-sm md:text-base px-3 py-1 rounded-full border-2 border-white shadow-lg">
              Lv. {gameData.user?.level || 1}
            </div>
          </div>

          <div className="flex-1 mt-2 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm mb-2">
              {greeting}, {gameData.user?.name?.split(' ')[0] || 'Aventurero'}
            </h1>
            <p className="text-brand-100 text-sm sm:text-base md:text-xl max-w-lg font-medium leading-relaxed mb-6 drop-shadow-sm mx-auto sm:mx-0">
              Tienes <strong className="text-white bg-white/10 px-1 md:px-2 py-0.5 rounded mx-0.5">{activeTasks.length} misiones urgentes</strong> y <strong className="text-white bg-white/10 px-1 md:px-2 py-0.5 rounded mx-0.5">{todayHabits.filter(h => !h.completedToday).length} hábitos vivos</strong>.
            </p>

            {/* Barras de Estado RPG Horizontales */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl mx-auto sm:mx-0 w-full">
              <div className="flex-1 bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10 shadow-inner group transition-all hover:bg-black/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs uppercase tracking-widest font-bold text-red-200 flex items-center gap-1.5">
                    <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isHpLow ? 'text-red-400 animate-pulse' : 'text-red-400'}`} /> 
                    Vitalidad
                  </span>
                  <span className="text-xs font-black font-mono tracking-wider">{currentHp}/{maxHp}</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isHpLow ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gradient-to-r from-red-500 to-green-400'}`} 
                    style={{ width: `${(currentHp / maxHp) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10 shadow-inner group transition-all hover:bg-black/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs uppercase tracking-widest font-bold text-blue-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" /> 
                    Energía Diaria
                  </span>
                  <span className="text-xs font-black font-mono tracking-wider">{dailyProgress}%</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                    style={{ width: `${dailyProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medallones a la derecha */}
        <div className="relative z-10 flex gap-3 sm:gap-4 md:gap-5 flex-shrink-0 justify-center w-full lg:w-auto mt-4 lg:mt-0 lg:flex-col xl:flex-row">
          <div className="flex-1 lg:flex-none bg-white/10 backdrop-blur-md rounded-[1.5rem] p-3 sm:p-4 md:p-6 flex flex-col items-center min-w-[90px] md:min-w-[100px] border border-white/20 shadow-xl hover:bg-white/20 transition-all cursor-default hover:-translate-y-1">
            <Coins className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-300 mb-1 sm:mb-2 drop-shadow-md" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-md">{gameData.user?.coins || 0}</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-brand-100 font-bold mt-1 opacity-80">Monedas</span>
          </div>
          <div className="flex-1 lg:flex-none bg-white/10 backdrop-blur-md rounded-[1.5rem] p-3 sm:p-4 md:p-6 flex flex-col items-center min-w-[90px] md:min-w-[100px] border border-white/20 shadow-xl hover:bg-white/20 transition-all cursor-default hover:-translate-y-1">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-400 mb-1 sm:mb-2 drop-shadow-md" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-md">{gameData.user?.streak || 0}</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-brand-100 font-bold mt-1 opacity-80">Racha</span>
          </div>
        </div>
      </div>

      {/* Grid de 3 Columnas para llenar el espacio de forma inteligente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Columna 1: Hábitos (Ocupa 4 columnas de 12 en LG) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center justify-between px-2">
            <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${themeConfig.text}`}>
              <Clock className="w-5 h-5 text-brand-500" />
              Rutina Diaria
            </h2>
            {setActiveSection && (
              <button 
                onClick={() => setActiveSection('habits')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full"
              >
                Todas
              </button>
            )}
          </div>

          <div className="space-y-3">
            {todayHabits.length > 0 ? (
              todayHabits.map(habit => (
                <div 
                  key={habit.id}
                  className={`group ${themeConfig.card} rounded-2xl p-4 border ${themeConfig.border} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center gap-4 ${habit.completedToday ? 'opacity-50 bg-gray-50/50 scale-[0.98]' : 'hover:-translate-y-1'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabit(habit.id);
                  }}
                >
                  <div className="flex-shrink-0">
                    {habit.completedToday ? (
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-200 group-hover:text-green-400 group-hover:scale-110 transition-all" />
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-gray-200/60 group-hover:shadow-md transition-all">
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-[15px] truncate ${habit.completedToday ? 'text-gray-400 line-through decoration-2' : themeConfig.text}`}>{habit.name}</h3>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-orange-50/80 text-orange-600 rounded-lg text-xs font-black border border-orange-100/50 group-hover:bg-orange-100 transition-colors">
                    <Flame className="w-3.5 h-3.5" />
                    {habit.streak}
                  </div>
                </div>
              ))
            ) : (
              <div className={`${themeConfig.card} rounded-3xl p-8 border-2 border-dashed ${themeConfig.border} text-center flex flex-col items-center justify-center h-48`}>
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-gray-300" />
                </div>
                <p className={`${themeConfig.textMuted} font-bold text-[15px]`}>Día libre</p>
                <p className="text-gray-400 text-xs mt-1 font-medium">Ningún hábito pendiente</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Misiones/Tareas (Ocupa 5 columnas de 12 en LG) - El centro neurálgico */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between px-2">
            <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${themeConfig.text}`}>
              <Target className="w-5 h-5 text-brand-500" />
              Misiones Activas
            </h2>
            {setActiveSection && (
              <button 
                onClick={() => setActiveSection('tasks')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full"
              >
                Inventario <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {activeTasks.length > 0 ? (
              activeTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => setActiveSection && setActiveSection('tasks')}
                  className={`group ${themeConfig.card} rounded-[1.5rem] p-5 border ${themeConfig.border} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col gap-3 hover:-translate-y-1 relative overflow-hidden`}
                >
                  {/* Borde izquierdo decorativo para tareas urgentes */}
                  {task.urgency === 'urgent' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0">
                      <Circle className="w-6 h-6 text-gray-200 group-hover:text-brand-400 group-hover:scale-110 transition-all font-bold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base leading-snug pr-8 ${themeConfig.text}`}>{task.title}</h3>
                      <p className="text-gray-400 text-xs mt-1 truncate font-medium">
                        {task.notes ? task.notes : (task.dueDate ? `Vence el ${new Date(task.dueDate).toLocaleDateString()}` : 'Sin notas adiconales')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1 pl-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority, task.urgency, task.importance)}`}>
                      {priorityLabel(task)}
                    </span>
                    <span className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50/80 px-2.5 py-1 rounded-lg font-black text-[11px] border border-yellow-100 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                      +{task.xp} XP
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={`${themeConfig.card} rounded-3xl p-8 border-2 border-dashed ${themeConfig.border} text-center flex flex-col items-center justify-center h-48 lg:h-72`}>
                <div className="w-20 h-20 bg-gray-50 rounded-2xl rotate-3 flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                  <Trophy className="w-10 h-10 text-gray-300 -rotate-3" />
                </div>
                <p className={`${themeConfig.textMuted} font-bold text-lg`}>Zona Despejada</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Has completado todas tus misiones principales. Ve a Explorar para añadir nuevas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 3: Recompensas (Ocupa 3 columnas de 12 en LG) - Novedad Visual */}
        <div className="md:col-span-2 lg:col-span-3 space-y-5">
           <div className="flex items-center justify-between px-2">
            <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${themeConfig.text}`}>
              <Gift className="w-5 h-5 text-purple-500" />
              Bazar
            </h2>
            {setActiveSection && (
              <button 
                onClick={() => setActiveSection('rewards')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full"
              >
                Tienda
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-4">
            {affordableRewards.length > 0 ? (
              affordableRewards.map(reward => {
                const canAfford = (gameData.user?.coins || 0) >= reward.cost;
                return (
                  <div 
                    key={reward.id}
                    onClick={() => setActiveSection && setActiveSection('rewards-user')}
                    className={`group ${themeConfig.card} rounded-[1.5rem] p-3 sm:p-4 border ${themeConfig.border} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-2 sm:gap-3 hover:-translate-y-1`}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-purple-100/50 group-hover:scale-110 transition-transform">
                      {reward.icon || '🎁'}
                    </div>
                    <div className="w-full">
                      <h3 className={`font-bold text-xs sm:text-[14px] leading-tight mb-1sm:mb-1.5 line-clamp-2 ${themeConfig.text}`}>{reward.name}</h3>
                      <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black mt-1 ${canAfford ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        {reward.cost}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`${themeConfig.card} col-span-2 md:col-span-4 lg:col-span-1 rounded-3xl p-6 border-2 border-dashed ${themeConfig.border} text-center flex flex-col items-center justify-center h-48`}>
                <Gift className="w-10 h-10 text-gray-300 mb-2 opacity-50" />
                <p className="text-gray-400 text-xs font-bold leading-relaxed px-4">Agrega recompensas a la tienda para motivarte</p>
                {setActiveSection && (
                  <button onClick={() => setActiveSection('rewards')} className="mt-3 text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                    Añadir Premio
                  </button>
                )}
              </div>
            )}
           </div>

            {/* Banner de motivación extra si sobra espacio */}
            <div className={`mt-4 sm:mt-6 rounded-3xl p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 relative overflow-hidden group hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-pointer w-full`} onClick={() => setActiveSection && setActiveSection('profile')}>
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-indigo-900" />
               </div>
               <div className="relative z-10">
                 <p className="text-[10px] sm:text-[11px] uppercase tracking-widest font-black text-indigo-400 mb-1">Tu Rango Actual</p>
                 <h4 className="text-base sm:text-lg font-black text-indigo-900 leading-tight pr-12">Sigue tu camino de héroe</h4>
                 <div className="mt-2 sm:mt-3 inline-flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                   Ver Perfil <ArrowRight className="w-3 h-3 ml-1" />
                 </div>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

