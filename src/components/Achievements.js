import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Flame, 
  Zap,
  Crown,
  Medal,
  Gem,
  Shield,
  Sword,
  Heart,
  Brain,
  Briefcase,
  Users,
  DollarSign,
  Home,
  Lock,
  Unlock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

// Sistema de Rangos y Niveles
const rankSystem = {
  levels: [
    { level: 1, title: 'Principiante', minXP: 0, maxXP: 100, icon: '🌱', color: 'from-green-400 to-emerald-600', unlockedFeatures: ['basic_habits', 'basic_tasks'] },
    { level: 2, title: 'Aprendiz', minXP: 100, maxXP: 250, icon: '📚', color: 'from-blue-400 to-indigo-600', unlockedFeatures: ['advanced_habits', 'habit_analytics'] },
    { level: 3, title: 'Experto', minXP: 250, maxXP: 500, icon: '⚡', color: 'from-purple-400 to-violet-600', unlockedFeatures: ['custom_rewards', 'weekly_challenges'] },
    { level: 4, title: 'Maestro', minXP: 500, maxXP: 1000, icon: '🏆', color: 'from-yellow-400 to-amber-600', unlockedFeatures: ['boss_battles', 'advanced_analytics'] },
    { level: 5, title: 'Leyenda', minXP: 1000, maxXP: Infinity, icon: '👑', color: 'from-red-400 to-rose-600', unlockedFeatures: ['all_features', 'premium_rewards'] }
  ],
  titles: {
    beginner: ['Novato', 'Aventurero', 'Explorador'],
    intermediate: ['Guerrero', 'Defensor', 'Guardián'],
    advanced: ['Conquistador', 'Campeón', 'Héroe'],
    master: ['Mentor', 'Sabio', 'Iluminado'],
    legend: ['Inmortal', 'Dios', 'Trascendido']
  }
};

// Sistema de Misiones y Quests
const questSystem = {
  daily: [
    { id: 'daily_complete', name: 'Completador Diario', description: 'Completa 3 hábitos hoy', reward: { xp: 15, coins: 8 }, requirement: 3 },
    { id: 'daily_perfect', name: 'Día Perfecto', description: 'Completa todos tus hábitos diarios', reward: { xp: 25, coins: 12 }, requirement: 'all' },
    { id: 'daily_streak', name: 'Fuego Sagrado', description: 'Mantén la racha diaria', reward: { xp: 10, coins: 5 }, requirement: 1 }
  ],
  weekly: [
    { id: 'week_warrior', name: 'Guerrero Semanal', description: '7 días seguidos de actividad', reward: { xp: 100, coins: 50 }, requirement: 7 },
    { id: 'week_diverse', name: 'Explorador', description: 'Completa hábitos de 3 áreas diferentes', reward: { xp: 75, coins: 35 }, requirement: 3 },
    { id: 'week_challenge', name: 'Desafío Semanal', description: 'Supera tu mejor semana', reward: { xp: 150, coins: 75 }, requirement: 'personal_best' }
  ],
  special: [
    { id: 'first_boss', name: 'Primer Boss', description: 'Derrota tu primer mal hábito', reward: { xp: 200, coins: 100, special: 'boss_unlock' }, requirement: 1 },
    { id: 'collection_master', name: 'Coleccionista', description: 'Colecciona 10 insignias diferentes', reward: { xp: 300, coins: 150, special: 'title_unlock' }, requirement: 10 }
  ]
};

// Sistema de Boss Battles
const bossBattles = {
  procrastination: {
    id: 'procrastination',
    name: 'Procrastinación',
    title: 'El Gran Demorador',
    description: 'Un monstruo que te impide empezar tus tareas',
    icon: '🦥',
    hp: 100,
    weakness: ['task_completion', 'time_management'],
    rewards: { xp: 150, coins: 75, achievement: 'boss_slayer' },
    attacks: [
      { name: 'Posposición Infinita', damage: 20, description: 'Te hace dejar todo para mañana' },
      { name: 'Distracción Total', damage: 15, description: 'Te aleja de tus objetivos' }
    ]
  },
  distraction: {
    id: 'distraction',
    name: 'Distracción',
    title: 'El Ladrón de Foco',
    description: 'Roba tu concentración cuando más la necesitas',
    icon: '📱',
    hp: 80,
    weakness: ['focus_habits', 'mindfulness'],
    rewards: { xp: 120, coins: 60, achievement: 'focus_master' },
    attacks: [
      { name: 'Notificación Mágica', damage: 25, description: 'Te llama la atención con cosas urgentes' },
      { name: 'Agujero de Conejo', damage: 30, description: 'Te hace caer en espirales infinitas' }
    ]
  },
  laziness: {
    id: 'laziness',
    name: 'Pereza',
    title: 'El Guardián del Sofá',
    description: 'Te ancla al sofá y no te deja mover',
    icon: '🛋️',
    hp: 120,
    weakness: ['exercise', 'morning_routine'],
    rewards: { xp: 180, coins: 90, achievement: 'energy_master' },
    attacks: [
      { name: 'Gravedad Aumentada', damage: 15, description: 'Hace que moverte sea imposible' },
      { name: 'Sueño Eterno', damage: 20, description: 'Te invita a dormir un poco más' }
    ]
  }
};

// Sistema de Colecciones
const collections = {
  starter: {
    id: 'starter',
    name: 'Colección de Iniciante',
    description: 'Completa tus primeros logros',
    items: ['first_day', 'task_rookie', 'habit_starter'],
    reward: { xp: 50, coins: 25, title: 'Novato Cumplido' }
  },
  warrior: {
    id: 'warrior',
    name: 'Colección de Guerreros',
    description: 'Demuestra tu valentía',
    items: ['week_warrior', 'task_expert', 'habit_builder'],
    reward: { xp: 150, coins: 75, title: 'Guerrero Fiero' }
  },
  master: {
    id: 'master',
    name: 'Colección de Maestros',
    description: 'Alcanza la maestría completa',
    items: ['month_master', 'task_legend', 'habit_legend'],
    reward: { xp: 500, coins: 250, title: 'Maestro Absoluto' }
  }
};

export const allAchievements = {
  // Streak Achievements
  streak: {
    'first_day': { 
      id: 'first_day', 
      name: 'Primer Paso', 
      description: 'Completa tu primer día de actividad',
      icon: '👟', 
      color: 'from-green-400 to-emerald-600',
      xp: 10,
      coins: 5,
      type: 'streak',
      requirement: 1
    },
    'week_warrior': { 
      id: 'week_warrior', 
      name: 'Guerrero Semanal', 
      description: 'Mantén una racha de 7 días',
      icon: '⚔️', 
      color: 'from-blue-400 to-indigo-600',
      xp: 50,
      coins: 25,
      type: 'streak',
      requirement: 7
    },
    'month_master': { 
      id: 'month_master', 
      name: 'Maestro Mensual', 
      description: 'Mantén una racha de 30 días',
      icon: '🗓️', 
      color: 'from-purple-400 to-violet-600',
      xp: 200,
      coins: 100,
      type: 'streak',
      requirement: 30
    },
    'century_club': { 
      id: 'century_club', 
      name: 'Club del Siglo', 
      description: 'Mantén una racha de 100 días',
      icon: '💯', 
      color: 'from-yellow-400 to-amber-600',
      xp: 500,
      coins: 250,
      type: 'streak',
      requirement: 100
    }
  },
  
  // Task Achievements
  tasks: {
    'task_rookie': { 
      id: 'task_rookie', 
      name: 'Novato en Tareas', 
      description: 'Completa 10 tareas',
      icon: '📝', 
      color: 'from-gray-400 to-gray-600',
      xp: 25,
      coins: 12,
      type: 'tasks',
      requirement: 10
    },
    'task_expert': { 
      id: 'task_expert', 
      name: 'Experto en Tareas', 
      description: 'Completa 50 tareas',
      icon: '📋', 
      color: 'from-blue-400 to-indigo-600',
      xp: 100,
      coins: 50,
      type: 'tasks',
      requirement: 50
    },
    'task_master': { 
      id: 'task_master', 
      name: 'Maestro de Tareas', 
      description: 'Completa 100 tareas',
      icon: '📊', 
      color: 'from-purple-400 to-violet-600',
      xp: 250,
      coins: 125,
      type: 'tasks',
      requirement: 100
    },
    'task_legend': { 
      id: 'task_legend', 
      name: 'Leyenda de Productividad', 
      description: 'Completa 500 tareas',
      icon: '👑', 
      color: 'from-yellow-400 to-amber-600',
      xp: 1000,
      coins: 500,
      type: 'tasks',
      requirement: 500
    }
  },

  // Habit Achievements
  habits: {
    'habit_starter': { 
      id: 'habit_starter', 
      name: 'Iniciador de Hábitos', 
      description: 'Crea 5 hábitos',
      icon: '🌱', 
      color: 'from-green-400 to-emerald-600',
      xp: 20,
      coins: 10,
      type: 'habits',
      requirement: 5
    },
    'habit_builder': { 
      id: 'habit_builder', 
      name: 'Constructor de Hábitos', 
      description: 'Crea 15 hábitos',
      icon: '🏗️', 
      color: 'from-blue-400 to-indigo-600',
      xp: 60,
      coins: 30,
      type: 'habits',
      requirement: 15
    },
    'habit_master': { 
      id: 'habit_master', 
      name: 'Maestro de Hábitos', 
      description: 'Crea 30 hábitos',
      icon: '🎯', 
      color: 'from-purple-400 to-violet-600',
      xp: 150,
      coins: 75,
      type: 'habits',
      requirement: 30
    }
  },

  // Area Achievements
  areas: {
    'health_hero': { 
      id: 'health_hero', 
      name: 'Héroe de la Salud', 
      description: 'Alcanza 80% en el área de Salud',
      icon: '❤️', 
      color: 'from-red-400 to-rose-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'health'
    },
    'career_champion': { 
      id: 'career_champion', 
      name: 'Campeón de Carrera', 
      description: 'Alcanza 80% en el área de Carrera',
      icon: '💼', 
      color: 'from-blue-400 to-indigo-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'career'
    },
    'relationship_guru': { 
      id: 'relationship_guru', 
      name: 'Gurú de Relaciones', 
      description: 'Alcanza 80% en el área de Relaciones',
      icon: '👥', 
      color: 'from-pink-400 to-rose-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'relationships'
    },
    'personal_sage': { 
      id: 'personal_sage', 
      name: 'Sabio Personal', 
      description: 'Alcanza 80% en el área de Desarrollo Personal',
      icon: '🧠', 
      color: 'from-purple-400 to-violet-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'personal'
    },
    'financial_wizard': { 
      id: 'financial_wizard', 
      name: 'Mago Financiero', 
      description: 'Alcanza 80% en el área de Finanzas',
      icon: '💰', 
      color: 'from-yellow-400 to-amber-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'finances'
    },
    'home_master': { 
      id: 'home_master', 
      name: 'Maestro del Hogar', 
      description: 'Alcanza 80% en el área de Hogar',
      icon: '🏠', 
      color: 'from-orange-400 to-red-600',
      xp: 100,
      coins: 50,
      type: 'areas',
      requirement: 'home'
    }
  },

  // Level Achievements
  levels: {
    'level_10': { 
      id: 'level_10', 
      name: 'Nivel 10', 
      description: 'Alcanza el nivel 10',
      icon: '⭐', 
      color: 'from-blue-400 to-indigo-600',
      xp: 50,
      coins: 25,
      type: 'levels',
      requirement: 10
    },
    'level_25': { 
      id: 'level_25', 
      name: 'Nivel 25', 
      description: 'Alcanza el nivel 25',
      icon: '🌟', 
      color: 'from-purple-400 to-violet-600',
      xp: 150,
      coins: 75,
      type: 'levels',
      requirement: 25
    },
    'level_50': { 
      id: 'level_50', 
      name: 'Nivel 50', 
      description: 'Alcanza el nivel 50',
      icon: '💫', 
      color: 'from-yellow-400 to-amber-600',
      xp: 300,
      coins: 150,
      type: 'levels',
      requirement: 50
    }
  },

  // Special Achievements
  special: {
    'perfectionist': { 
      id: 'perfectionist', 
      name: 'Perfeccionista', 
      description: 'Completa todas las tareas de alta prioridad en una semana',
      icon: '✨', 
      color: 'from-purple-400 to-pink-600',
      xp: 200,
      coins: 100,
      type: 'special',
      requirement: null,
      hidden: true
    },
    'early_bird': { 
      id: 'early_bird', 
      name: 'Madrugador', 
      description: 'Completa 5 tareas antes de las 8 AM por 7 días seguidos',
      icon: '🐦', 
      color: 'from-yellow-400 to-orange-600',
      xp: 150,
      coins: 75,
      type: 'special',
      requirement: null,
      hidden: true
    },
    'balanced_life': { 
      id: 'balanced_life', 
      name: 'Vida Equilibrada', 
      description: 'Alcanza 60% en todas las áreas de vida',
      icon: '⚖️', 
      color: 'from-green-400 to-blue-600',
      xp: 300,
      coins: 150,
      type: 'special',
      requirement: null,
      hidden: true
    }
  }
};

function Achievements({ addNotification }) {
  const { gameData } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unlocked', 'locked'

  // Fetch unlocked achievements from global context
  const unlockedAchievements = useMemo(() => {
    return new Set(gameData.achievements || []);
  }, [gameData.achievements]);

  // Filter achievements based on selected category
  const filteredAchievements = useMemo(() => {
    let achievements = [];
    
    if (selectedCategory === 'all') {
      Object.values(allAchievements).forEach(category => {
        achievements.push(...Object.values(category));
      });
    } else {
      achievements = Object.values(allAchievements[selectedCategory] || {});
    }

    return achievements.filter(achievement => {
      const isUnlocked = unlockedAchievements.has(achievement.id);
      if (filterStatus === 'unlocked') return isUnlocked;
      if (filterStatus === 'locked') return !isUnlocked;
      return true; // 'all'
    });
  }, [selectedCategory, filterStatus, unlockedAchievements]);

  // Calculate stats
  const totalAchievements = Object.values(allAchievements).reduce((sum, category) => sum + Object.keys(category).length, 0);
  const unlockedCount = unlockedAchievements.size;
  const completionRate = Math.round((unlockedCount / totalAchievements) * 100);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏆', count: totalAchievements },
    { id: 'streak', name: 'Rachas', icon: '🔥', count: Object.keys(allAchievements.streak).length },
    { id: 'tasks', name: 'Tareas', icon: '📝', count: Object.keys(allAchievements.tasks).length },
    { id: 'habits', name: 'Hábitos', icon: '🔄', count: Object.keys(allAchievements.habits).length },
    { id: 'areas', name: 'Áreas', icon: '🎯', count: Object.keys(allAchievements.areas).length },
    { id: 'levels', name: 'Niveles', icon: '⭐', count: Object.keys(allAchievements.levels).length },
    { id: 'special', name: 'Especiales', icon: '✨', count: Object.keys(allAchievements.special).length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Logros y Badges</h1>
          <p className="text-gray-600">Desbloquea recompensas por tus logros</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-glow p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{unlockedCount}</div>
          <div className="text-gray-600 text-sm">Logros Desbloqueados</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{completionRate}%</div>
          <div className="text-gray-600 text-sm">Progreso Total</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {unlockedCount * 50}
          </div>
          <div className="text-gray-600 text-sm">XP de Logros</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {unlockedCount * 25}
          </div>
          <div className="text-gray-600 text-sm">Coins de Logros</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card-glow p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Toggle Filter */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="filter"
              checked={filterStatus === 'all'}
              onChange={() => setFilterStatus('all')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Todos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="filter"
              checked={filterStatus === 'unlocked'}
              onChange={() => setFilterStatus('unlocked')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Completados</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="filter"
              checked={filterStatus === 'locked'}
              onChange={() => setFilterStatus('locked')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Bloqueados</span>
          </label>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.has(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`card-glow p-4 relative overflow-hidden transition-all ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              {/* Lock/Unlock Status */}
              <div className="absolute top-2 right-2">
                {isUnlocked ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Achievement Icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${achievement.color} flex items-center justify-center text-2xl shadow-lg ${
                  !isUnlocked && 'grayscale'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-1 ${
                    isUnlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>
                  {achievement.hidden && !isUnlocked && (
                    <span className="text-xs text-purple-600 font-medium">🔓 Oculto</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={`text-xs mb-3 ${
                isUnlocked ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {achievement.hidden && !isUnlocked ? 'Completa requisitos especiales para desbloquear' : achievement.description}
              </p>

              {/* Rewards */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    isUnlocked ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    +{achievement.xp} XP
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    isUnlocked ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    +{achievement.coins} 💰
                  </div>
                </div>
                
                {/* Progress indicator for non-hidden achievements */}
                {!achievement.hidden && !isUnlocked && (
                  <div className="text-xs text-gray-500">
                    {achievement.type === 'streak' && `${gameData.user.streak}/${achievement.requirement}`}
                    {achievement.type === 'tasks' && `${gameData.tasks.filter(t => t.completed).length}/${achievement.requirement}`}
                    {achievement.type === 'habits' && `${gameData.habits.length}/${achievement.requirement}`}
                    {achievement.type === 'levels' && `${gameData.user.level}/${achievement.requirement}`}
                    {achievement.type === 'areas' && `${gameData.lifeAreas.find(a => a.id === achievement.requirement)?.progress || 0}%`}
                  </div>
                )}
              </div>

              {/* Unlocked animation effect */}
              {isUnlocked && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {filterStatus === 'unlocked' ? 'No hay logros desbloqueados' : filterStatus === 'locked' ? '¡Todos los logros desbloqueados!' : 'No se encontraron logros'}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'unlocked' 
              ? 'Completa más actividades para desbloquear tu primer logro'
              : filterStatus === 'locked' ? '¡Eres una leyenda! Has desbloqueado todos los logros disponibles.' : ''
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default Achievements;
