import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap, 
  Award, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Star,
  Trophy,
  CheckCircle
} from 'lucide-react';

function Dashboard({ addNotification }) {
  const { gameData, themes } = useData();
  const [timeRange, setTimeRange] = useState('week');
  
  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;

  // Use the same logic as Habits component to get habit data
  const getHabitsData = () => {
    if (gameData.habits && gameData.habits.length > 0) {
      return gameData.habits;
    }
    // If no habits in gameData, return empty array (don't use example data in Dashboard)
    return [];
  };

  const allHabits = getHabitsData();
  const analytics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const getDateRange = () => {
      switch(timeRange) {
        case 'week': return weekAgo;
        case 'month': return monthAgo;
        case 'year': return yearAgo;
        default: return weekAgo;
      }
    };

    const rangeStart = getDateRange();

    // Filter data by time range
    const recentTasks = gameData.tasks.filter(task => 
      new Date(task.createdAt) >= rangeStart
    );
    const recentHabits = allHabits.filter(habit => 
      new Date(habit.createdAt) >= rangeStart
    );
    const completedTasks = recentTasks.filter(task => task.completed);
    const completedHabits = recentHabits.filter(habit => 
      habit.completedToday || habit.totalCompletions > 0
    );

    // Calculate productivity metrics (tasks + habits)
    const taskXP = completedTasks.reduce((sum, task) => sum + (task.xp || 0), 0);
    const taskCoins = completedTasks.reduce((sum, task) => sum + (task.coins || 0), 0);
    const habitXP = completedHabits.reduce((sum, habit) => sum + (habit.xp || 0), 0);
    const habitCoins = completedHabits.reduce((sum, habit) => sum + (habit.coins || 0), 0);
    const totalXP = taskXP + habitXP;
    const totalCoins = taskCoins + habitCoins;
    
    // Area performance
    const areaPerformance = gameData.lifeAreas.map(area => {
      const areaTasks = gameData.tasks.filter(task => task.category === area.id);
      const completedAreaTasks = areaTasks.filter(task => task.completed);
      const areaHabits = allHabits.filter(habit => habit.category === area.id);
      
      return {
        id: area.id,
        name: area.id,
        progress: area.progress,
        tasksCompleted: completedAreaTasks.length,
        totalTasks: areaTasks.length,
        habitsActive: areaHabits.length,
        efficiency: areaTasks.length > 0 ? (completedAreaTasks.length / areaTasks.length) * 100 : 0
      };
    });

    // Daily activity (last 7 days)
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      
      const dayTasks = gameData.tasks.filter(task => 
        task.completedAt && new Date(task.completedAt).toDateString() === dateStr
      );
      const dayHabits = allHabits.filter(habit => 
        habit.completedToday || (habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === dateStr)
      );

      dailyActivity.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        tasks: dayTasks.length,
        habits: dayHabits.length,
        total: dayTasks.length + dayHabits.length
      });
    }

    // Completion rates by priority
    const priorityStats = {
      high: { completed: 0, total: 0 },
      medium: { completed: 0, total: 0 },
      low: { completed: 0, total: 0 }
    };

    gameData.tasks.forEach(task => {
      if (task.priority) {
        priorityStats[task.priority].total++;
        if (task.completed) {
          priorityStats[task.priority].completed++;
        }
      }
    });

    // Calculate productivity score
    const productivityScore = Math.round(
      (completedTasks.length * 10 + 
       completedHabits.reduce((sum, habit) => sum + (habit.streak || 0), 0) * 5 +
       gameData.user.streak * 2) / 
      Math.max(1, recentTasks.length + recentHabits.length)
    );

    // Best performing day
    const bestDay = dailyActivity.reduce((best, day) => 
      day.total > best.total ? day : best, dailyActivity[0] || { total: 0 }
    );

    return {
      totalTasks: recentTasks.length,
      completedTasks: completedTasks.length,
      totalHabits: allHabits.length,
      activeHabits: completedHabits.length,
      habitsCompletedToday: allHabits.filter(h => h.completedToday).length,
      totalXP,
      totalCoins,
      areaPerformance,
      dailyActivity,
      priorityStats,
      productivityScore,
      bestDay,
      completionRate: recentTasks.length > 0 ? 
        Math.round((completedTasks.length / recentTasks.length) * 100) : 0,
      streakBonus: gameData.user.streak * 5
    };
  }, [gameData, timeRange]);

  const getAreaIcon = (areaId) => {
    const icons = {
      health: '❤️',
      career: '💼',
      relationships: '👥',
      personal: '🧠',
      finances: '💰',
      home: '🏠'
    };
    return icons[areaId] || '📊';
  };

  const getAreaName = (areaId) => {
    const names = {
      health: 'Salud',
      career: 'Carrera',
      relationships: 'Relaciones',
      personal: 'Personal',
      finances: 'Finanzas',
      home: 'Hogar'
    };
    return names[areaId] || areaId;
  };

  return (
    <div className={`space-y-6 ${themeConfig.text}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${themeConfig.text}`}>Dashboard Analytics</h1>
          <p className={themeConfig.textMuted}>Tu progreso detallado y estadísticas</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-brand-600 text-white'
                  : `${themeConfig.card} ${themeConfig.text} ${themeConfig.border} hover:bg-gray-100`
              }`}
            >
              {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
        <div className={`card-glow p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
          <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mb-2 md:mb-3" />
          <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-blue-400`}>{analytics.completionRate}%</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 text-center`}>Completado</div>
        </div>
        
        <div className={`card-glow p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mb-2 md:mb-3" />
          <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-yellow-600 to-yellow-400`}>{analytics.totalXP}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 text-center`}>Total XP</div>
        </div>
        
        <div className={`card-glow p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-500 mb-2 md:mb-3" />
          <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-400`}>{analytics.productivityScore}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 text-center`}>Productividad</div>
        </div>
        
        <div className={`card-glow p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
          <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mb-2 md:mb-3" />
          <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-orange-600 to-orange-400`}>{gameData.user.streak}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 text-center`}>Días de racha</div>
        </div>
        
        <div className={`card-glow p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden group col-span-2 md:col-span-1`}>
          <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
          <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-500 mb-2 md:mb-3" />
          <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-green-400`}>{analytics.totalHabits}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 text-center`}>Total Hábitos</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className={`card-glow p-6`}>
          <h3 className={`text-md font-bold mb-6 flex items-center gap-2 ${themeConfig.text}`}>
            <Activity className="w-5 h-5 text-gray-400" />
            Actividad Diaria
          </h3>
          <div className="space-y-3">
            {analytics.dailyActivity.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-12 text-sm ${themeConfig.textMuted}`}>{day.date}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-brand-400 to-brand-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.min(100, day.total * 10)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{day.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 text-sm ${themeConfig.textMuted}`}>
            Mejor día: <strong className={themeConfig.text}>{analytics.bestDay.date}</strong> con {analytics.bestDay.total} actividades
          </div>
        </div>

        {/* Area Performance */}
        <div className={`card-glow p-6`}>
          <h3 className={`text-md font-bold mb-6 flex items-center gap-2 ${themeConfig.text}`}>
            <PieChart className="w-5 h-5 text-gray-400" />
            Rendimiento por Área
          </h3>
          <div className="space-y-3">
            {analytics.areaPerformance
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 6)
              .map(area => (
                <div key={area.id} className="flex items-center gap-3">
                  <div className="w-8 text-lg">{getAreaIcon(area.id)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${themeConfig.text}`}>
                        {getAreaName(area.id)}
                      </span>
                      <span className={`text-sm ${themeConfig.textMuted}`}>{area.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Priority Performance */}
      <div className={`${themeConfig.card} p-6 rounded-xl border ${themeConfig.border}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${themeConfig.text}`}>
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Rendimiento por Prioridad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analytics.priorityStats).map(([priority, stats]) => {
            const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const priorityColors = {
              high: 'from-red-400 to-red-600',
              medium: 'from-yellow-400 to-yellow-600',
              low: 'from-green-400 to-green-600'
            };
            const priorityNames = {
              high: 'Alta',
              medium: 'Media',
              low: 'Baja'
            };

            return (
              <div key={priority} className={`rounded-xl p-4 bg-gray-50/50 border ${themeConfig.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold text-sm ${themeConfig.text}`}>{priorityNames[priority]}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold bg-gradient-to-r ${priorityColors[priority]} text-white shadow-sm`}>
                    {stats.completed}/{stats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`bg-gradient-to-r ${priorityColors[priority]} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className={`text-sm ${themeConfig.textMuted}`}>
                  {completionRate}% completado
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className={`${themeConfig.card} p-6 rounded-xl border ${themeConfig.border}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${themeConfig.text}`}>
          <Star className="w-5 h-5 text-yellow-600" />
          Insights y Recomendaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${themeConfig.bg} rounded-lg p-4 border ${themeConfig.border}`}>
            <h4 className={`font-medium mb-2 ${themeConfig.text}`}>📈 Tendencia Positiva</h4>
            <p className={`text-sm ${themeConfig.textMuted}`}>
              Has completado {analytics.completedTasks} tareas este {timeRange === 'week' ? 'semana' : timeRange === 'month' ? 'mes' : 'año'}. 
              ¡Sigue así!
            </p>
          </div>
          
          <div className={`${themeConfig.bg} rounded-lg p-4 border ${themeConfig.border}`}>
            <h4 className={`font-medium mb-2 ${themeConfig.text}`}>🎯 Área Destacada</h4>
            <p className={`text-sm ${themeConfig.textMuted}`}>
              Tu mejor área es {
                analytics.areaPerformance.reduce((best, area) => 
                  area.progress > best.progress ? area : best
                ).name
              } con {
                Math.max(...analytics.areaPerformance.map(a => a.progress))
              }% de progreso.
            </p>
          </div>
          
          <div className={`${themeConfig.bg} rounded-lg p-4 border ${themeConfig.border}`}>
            <h4 className={`font-medium mb-2 ${themeConfig.text}`}>⚡ Productividad</h4>
            <p className={`text-sm ${themeConfig.textMuted}`}>
              Tu score de productividad es {analytics.productivityScore}. 
              {analytics.productivityScore > 50 ? ' ¡Excelente rendimiento!' : ' Hay espacio para mejorar.'}
            </p>
          </div>
          
          <div className={`${themeConfig.bg} rounded-lg p-4 border ${themeConfig.border}`}>
            <h4 className={`font-medium mb-2 ${themeConfig.text}`}>🔥 Motivación</h4>
            <p className={`text-sm ${themeConfig.textMuted}`}>
              Llevas {gameData.user.streak} días de racha. 
              {gameData.user.streak > 7 ? ' ¡Eres increíblemente consistente!' : ' Mantén la constancia!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
