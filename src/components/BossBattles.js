import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Skull, 
  Trophy, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Target,
  Flame,
  Award,
  Lock,
  Unlock,
  Clock,
  AlertCircle
} from 'lucide-react';

// Sistema de Boss Battles - Retos de Productividad Real
const bossBattles = {
  procrastination: {
    id: 'procrastination',
    name: 'Procrastinación',
    title: 'El Gran Demorador',
    description: 'Te impide empezar tus tareas importantes',
    icon: '🦥',
    challengeType: 'focus_session',
    baseDifficulty: 'medium',
    weakness: ['deep_work', 'time_blocking'],
    rewards: { xp: 150, coins: 75, achievement: 'procrastination_slayer' },
    challenge: {
      type: 'pomodoro',
      duration: 25, // minutos
      targetDistractions: 3, // máximo permitido
      description: 'Completa una sesión Pomodoro de 25 minutos sin distracciones'
    }
  },
  distraction: {
    id: 'distraction',
    name: 'Distracción',
    title: 'El Ladrón de Foco',
    description: 'Roba tu concentración cuando más la necesitas',
    icon: '📱',
    challengeType: 'deep_work',
    baseDifficulty: 'hard',
    weakness: ['digital_detox', 'single_tasking'],
    rewards: { xp: 200, coins: 100, achievement: 'focus_master' },
    challenge: {
      type: 'deep_focus',
      duration: 45, // minutos
      targetSwitches: 2, // máximo cambios de tarea permitidos
      description: 'Trabajo enfocado por 45 minutos sin cambiar de tarea'
    }
  },
  laziness: {
    id: 'laziness',
    name: 'Pereza',
    title: 'El Guardián del Sofá',
    description: 'Te ancla a la inactividad y te impide moverte',
    icon: '🛋️',
    challengeType: 'physical_activity',
    baseDifficulty: 'medium',
    weakness: ['movement', 'energy_boost'],
    rewards: { xp: 180, coins: 90, achievement: 'energy_master' },
    challenge: {
      type: 'exercise',
      duration: 30, // minutos
      intensity: 'moderate',
      description: 'Realiza 30 minutos de ejercicio físico'
    }
  },
  perfectionism: {
    id: 'perfectionism',
    name: 'Perfeccionismo',
    title: 'El Juez Implacable',
    description: 'Te exige perfección y te paraliza con el miedo a fallar',
    icon: '⚖️',
    challengeType: 'imperfection',
    baseDifficulty: 'hard',
    weakness: ['progress_over_perfection', 'quick_wins'],
    rewards: { xp: 220, coins: 110, achievement: 'progress_master' },
    challenge: {
      type: 'imperfect_action',
      tasks: 5,
      timeLimit: 60, // minutos
      qualityStandard: 'good_enough',
      description: 'Completa 5 tareas con estándar "suficientemente bueno" en 60 minutos'
    }
  },
  fear: {
    id: 'fear',
    name: 'Miedo al Fracaso',
    title: 'El Guardián de la Zona de Confort',
    description: 'Te impide intentar cosas nuevas por miedo a fallar',
    icon: '😰',
    challengeType: 'courage',
    baseDifficulty: 'extreme',
    weakness: ['small_steps', 'learning_mindset'],
    rewards: { xp: 300, coins: 150, achievement: 'fear_conqueror' },
    challenge: {
      type: 'new_challenge',
      difficulty: 'uncomfortable',
      attempts: 3,
      description: 'Intenta 3 cosas nuevas que te saquen de tu zona de confort'
    }
  },
  burnout: {
    id: 'burnout',
    name: 'Burnout',
    title: 'El Consumidor de Energía',
    description: 'Te agota hasta el punto que no puedes continuar',
    icon: '🔥',
    challengeType: 'recovery',
    baseDifficulty: 'extreme',
    weakness: ['rest', 'boundaries', 'self_care'],
    rewards: { xp: 250, coins: 125, achievement: 'balance_master' },
    challenge: {
      type: 'digital_detox',
      duration: 120, // minutos sin pantalla
      activities: ['meditation', 'nature_walk', 'creative_hobby'],
      description: '2 horas de detox digital con actividades restauradoras'
    }
  }
};

// Sistema de dificultad dinámica para retos de productividad
const calculateDynamicBoss = (baseBoss, playerLevel, playerStats) => {
  const progressMultiplier = 1 + (playerLevel - 1) * 0.25; // 25% más difícil por nivel
  const experienceMultiplier = Math.max(0.7, Math.min(2.0, (playerStats.totalHabitsCompleted || 0) / 30)); // Basado en experiencia
  
  // Ajustar la dificultad del reto según nivel
  const adjustedChallenge = { ...baseBoss.challenge };
  
  switch (baseBoss.challenge.type) {
    case 'pomodoro':
      adjustedChallenge.duration = Math.round(baseBoss.challenge.duration * (1 + (playerLevel - 1) * 0.2));
      adjustedChallenge.targetDistractions = Math.max(1, baseBoss.challenge.targetDistractions - Math.floor((playerLevel - 1) / 2));
      break;
    case 'deep_focus':
      adjustedChallenge.duration = Math.round(baseBoss.challenge.duration * (1 + (playerLevel - 1) * 0.3));
      adjustedChallenge.targetSwitches = Math.max(1, baseBoss.challenge.targetSwitches - Math.floor((playerLevel - 1) / 3));
      break;
    case 'exercise':
      adjustedChallenge.duration = Math.round(baseBoss.challenge.duration * (1 + (playerLevel - 1) * 0.25));
      adjustedChallenge.intensity = playerLevel >= 3 ? 'vigorous' : 'moderate';
      break;
    case 'imperfect_action':
      adjustedChallenge.tasks = Math.min(10, baseBoss.challenge.tasks + Math.floor((playerLevel - 1) / 2));
      adjustedChallenge.timeLimit = Math.max(30, baseBoss.challenge.timeLimit - (playerLevel - 1) * 5);
      break;
    case 'new_challenge':
      adjustedChallenge.attempts = Math.min(5, baseBoss.challenge.attempts + Math.floor((playerLevel - 1) / 2));
      break;
    case 'digital_detox':
      adjustedChallenge.duration = Math.round(baseBoss.challenge.duration * (1 + (playerLevel - 1) * 0.2));
      break;
  }
  
  // Determinar la dificultad visual
  let difficultyLevel = 'medium';
  if (playerLevel <= 2) difficultyLevel = 'medium';
  else if (playerLevel <= 4) difficultyLevel = 'hard';
  else if (playerLevel <= 6) difficultyLevel = 'extreme';
  else difficultyLevel = 'legendary';
  
  const dynamicBoss = {
    ...baseBoss,
    challenge: adjustedChallenge,
    level: playerLevel,
    difficulty: difficultyLevel,
    progressMultiplier,
    experienceMultiplier
  };
  
  // Ajustar recompensas según dificultad y nivel
  dynamicBoss.rewards = {
    ...baseBoss.rewards,
    xp: Math.round(baseBoss.rewards.xp * progressMultiplier * experienceMultiplier),
    coins: Math.round(baseBoss.rewards.coins * progressMultiplier * experienceMultiplier)
  };
  
  return dynamicBoss;
};

// Sistema de condiciones de victoria dinámicas
const getVictoryCondition = (bossId, playerLevel) => {
  const baseConditions = {
    procrastination: {
      level1: { type: 'complete_tasks', requirement: 3, description: 'Completa 3 tareas' },
      level2: { type: 'complete_tasks', requirement: 5, description: 'Completa 5 tareas' },
      level3: { type: 'complete_tasks', requirement: 8, description: 'Completa 8 tareas' },
      level4: { type: 'complete_tasks', requirement: 12, description: 'Completa 12 tareas' },
      level5: { type: 'complete_tasks', requirement: 20, description: 'Completa 20 tareas' }
    },
    distraction: {
      level1: { type: 'focus_habits', requirement: 5, description: 'Completa 5 hábitos de focus' },
      level2: { type: 'focus_habits', requirement: 10, description: 'Completa 10 hábitos de focus' },
      level3: { type: 'focus_habits', requirement: 15, description: 'Completa 15 hábitos de focus' },
      level4: { type: 'focus_habits', requirement: 25, description: 'Completa 25 hábitos de focus' },
      level5: { type: 'focus_habits', requirement: 40, description: 'Completa 40 hábitos de focus' }
    },
    laziness: {
      level1: { type: 'exercise_streak', requirement: 3, description: 'Mantén 3 días de ejercicio' },
      level2: { type: 'exercise_streak', requirement: 7, description: 'Mantén 7 días de ejercicio' },
      level3: { type: 'exercise_streak', requirement: 14, description: 'Mantén 14 días de ejercicio' },
      level4: { type: 'exercise_streak', requirement: 21, description: 'Mantén 21 días de ejercicio' },
      level5: { type: 'exercise_streak', requirement: 30, description: 'Mantén 30 días de ejercicio' }
    },
    // Condiciones por defecto para otros bosses
    default: {
      level1: { type: 'none', requirement: 0, description: 'Sin requisitos' },
      level2: { type: 'none', requirement: 0, description: 'Sin requisitos' },
      level3: { type: 'none', requirement: 0, description: 'Sin requisitos' },
      level4: { type: 'none', requirement: 0, description: 'Sin requisitos' },
      level5: { type: 'none', requirement: 0, description: 'Sin requisitos' }
    }
  };
  
  const levelKey = `level${Math.min(playerLevel, 5)}`;
  return baseConditions[bossId]?.[levelKey] || baseConditions.default[levelKey];
};

function BossBattles({ addNotification }) {
  const { gameData, updateGameData } = useData();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeLog, setChallengeLog] = useState([]);
  const [challengeStartTime, setChallengeStartTime] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [challengeResult, setChallengeResult] = useState(null);
  const [unlockedBosses, setUnlockedBosses] = useState(['procrastination']); // Primer boss desbloqueado
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Estados para el Pomodoro (declarados aquí antes de usarlos)
  const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work', 'short_break', 'long_break'
  const [pomodoroSession, setPomodoroSession] = useState(1); // Número de sesión actual
  const [pomodoroSessionsCompleted, setPomodoroSessionsCompleted] = useState(0);
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Verificar condiciones para desbloquear bosses
  useEffect(() => {
    const checkUnlockConditions = () => {
      const newUnlocked = [...unlockedBosses];
      
      // Desbloquear Distraction si tiene hábitos de focus
      const hasFocusHabits = gameData.habits?.some(h => 
        h.name.toLowerCase().includes('meditar') || 
        h.name.toLowerCase().includes('focus') ||
        h.name.toLowerCase().includes('concentración')
      );
      if (hasFocusHabits && !unlockedBosses.includes('distraction')) {
        newUnlocked.push('distraction');
      }
      
      // Desbloquear Pereza si tiene hábitos de ejercicio
      const hasExerciseHabits = gameData.habits?.some(h => 
        h.name.toLowerCase().includes('ejercicio') || 
        h.name.toLowerCase().includes('gimnasio') ||
        h.name.toLowerCase().includes('correr')
      );
      if (hasExerciseHabits && !unlockedBosses.includes('laziness')) {
        newUnlocked.push('laziness');
      }
      
      // Desbloquear Perfeccionismo si tiene tareas
      if (gameData.tasks?.length > 5 && !unlockedBosses.includes('perfectionism')) {
        newUnlocked.push('perfectionism');
      }
      
      // Desbloquear Miedo si tiene nivel alto
      if (gameData.user?.level >= 3 && !unlockedBosses.includes('fear')) {
        newUnlocked.push('fear');
      }
      
      if (newUnlocked.length > unlockedBosses.length) {
        setUnlockedBosses(newUnlocked);
        const newBoss = newUnlocked[newUnlocked.length - 1];
        const boss = bossBattles[newBoss];
        addNotification(`🔓 Nuevo boss desbloqueado: ${boss.title}!`, 'success');
      }
    };
    
    checkUnlockConditions();
  }, [gameData, unlockedBosses, addNotification]);

  // Timer para el desafío con soporte Pomodoro
  useEffect(() => {
    let interval;
    if (isTimerRunning && challengeStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - challengeStartTime) / 1000);
        setElapsedTime(elapsed);
        
        // Si es un desafío Pomodoro activo
        if (showPomodoro && activeChallenge?.challenge?.type === 'pomodoro') {
          const phaseDuration = pomodoroConfig[pomodoroPhase];
          
          if (elapsed >= phaseDuration) {
            handlePomodoroPhaseChange();
          }
        } else if (activeChallenge && !showPomodoro) {
          // Verificar si se completó el tiempo del desafío normal
          if (elapsed >= activeChallenge.challenge.duration * 60) {
            completeChallenge(true);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, challengeStartTime, activeChallenge, showPomodoro, pomodoroPhase]);

  const startChallenge = (bossId) => {
    const baseBoss = bossBattles[bossId];
    const playerLevel = gameData.user?.level || 1;
    const playerStats = gameData.user || {};
    
    // Calcular desafío dinámico según nivel
    const dynamicBoss = calculateDynamicBoss(baseBoss, playerLevel, playerStats);
    
    // Verificar si el jugador cumple las condiciones para enfrentar este boss
    const victoryCondition = getVictoryCondition(bossId, playerLevel);
    const canBattle = checkBattleCondition(bossId, victoryCondition);
    
    if (!canBattle) {
      addNotification(`⚠️ Necesitas ${victoryCondition.description} antes de enfrentar a ${baseBoss.title}`, 'warning');
      return;
    }
    
    setActiveChallenge(dynamicBoss);
    setChallengeResult(null);
    setChallengeLog([
      `🎯 Desafío contra ${baseBoss.title} iniciado!`,
      `📊 Dificultad: ${dynamicBoss.difficulty} (Nivel ${playerLevel})`,
      `⏱️ Duración: ${dynamicBoss.challenge.duration} minutos`,
      `🎪 Objetivo: ${dynamicBoss.challenge.description}`
    ]);
    
    // Si es un desafío Pomodoro, iniciar el Pomodoro
    if (dynamicBoss.challenge.type === 'pomodoro') {
      startPomodoro();
    } else {
      // Desafío normal
      setChallengeStartTime(Date.now());
      setElapsedTime(0);
      setIsTimerRunning(true);
    }
  };

  const completeChallenge = (success) => {
    setIsTimerRunning(false);
    const challenge = activeChallenge;
    
    if (success) {
      // Para desafíos Pomodoro, verificar si se completaron las sesiones necesarias
      if (challenge?.challenge?.type === 'pomodoro') {
        const requiredSessions = Math.ceil(challenge.challenge.duration / 25); // Calcular sesiones requeridas
        
        if (pomodoroSessionsCompleted < requiredSessions) {
          addNotification(`⏳ Necesitas completar ${requiredSessions} sesiones Pomodoro. Llevas ${pomodoroSessionsCompleted}`, 'warning');
          setIsTimerRunning(true); // Continuar el Pomodoro
          return;
        }
      }
      
      // Desafío completado exitosamente
      setChallengeResult('victory');
      setChallengeLog(prev => [...prev, `🎉 ¡Desafío completado! Has derrotado a ${challenge.title}!`]);
      
      // Otorgar recompensas
      const updatedUser = {
        ...gameData.user,
        xp: gameData.user.xp + challenge.rewards.xp,
        coins: gameData.user.coins + challenge.rewards.coins
      };
      
      // Guardar logro
      const achievements = gameData.achievements || [];
      if (!achievements.includes(challenge.rewards.achievement)) {
        achievements.push(challenge.rewards.achievement);
      }
      
      updateGameData({
        user: updatedUser,
        achievements: achievements,
        defeatedBosses: [...(gameData.defeatedBosses || []), challenge.id]
      });
      
      addNotification(`🏆 ¡Victoria! Has completado el desafío y ganado +${challenge.rewards.xp} XP y +${challenge.rewards.coins} coins`, 'success');
    } else {
      // Desafío fallido
      setChallengeResult('defeat');
      setChallengeLog(prev => [...prev, `💀 No has completado el desafío contra ${challenge.title}...`]);
      addNotification('💀 Desafío no completado. Intenta de nuevo cuando estés más preparado', 'error');
    }
    
    // Resetear Pomodoro si estaba activo
    if (showPomodoro) {
      setShowPomodoro(false);
    }
  };

  const abandonChallenge = () => {
    setIsTimerRunning(false);
    setActiveChallenge(null);
    setChallengeLog([]);
    setElapsedTime(0);
    addNotification('🏃 Has abandonado el desafío', 'info');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Configuración Pomodoro
  const pomodoroConfig = {
    work: 25 * 60, // 25 minutos
    short_break: 5 * 60, // 5 minutos
    long_break: 15 * 60, // 15 minutos
    sessions_until_long_break: 4
  };

  // Resetear Pomodoro
  const resetPomodoro = () => {
    setPomodoroPhase('work');
    setPomodoroSession(1);
    setPomodoroSessionsCompleted(0);
    setElapsedTime(0);
    setIsTimerRunning(false);
  };

  // Iniciar Pomodoro
  const startPomodoro = () => {
    resetPomodoro();
    setShowPomodoro(true);
    setIsTimerRunning(true);
    setChallengeStartTime(Date.now());
  };

  // Manejar cambio de fase Pomodoro
  const handlePomodoroPhaseChange = () => {
    const currentPhase = pomodoroPhase;
    
    if (currentPhase === 'work') {
      setPomodoroSessionsCompleted(prev => prev + 1);
      
      if (pomodoroSession % 4 === 0) {
        // Long break después de 4 sesiones
        setPomodoroPhase('long_break');
        setElapsedTime(0);
        addNotification('🎉 ¡Sesión completada! Tomando un descanso largo de 15 minutos', 'success');
      } else {
        // Short break
        setPomodoroPhase('short_break');
        setElapsedTime(0);
        addNotification('✅ ¡Sesión completada! Tomando un descanso corto de 5 minutos', 'success');
      }
    } else {
      // Volver al trabajo
      setPomodoroPhase('work');
      setPomodoroSession(prev => prev + 1);
      setElapsedTime(0);
      addNotification('💪 ¡Descanso terminado! De vuelta al trabajo', 'info');
    }
    
    setChallengeStartTime(Date.now());
  };

  // Verificar si el jugador puede enfrentar al boss
const checkBattleCondition = (bossId, victoryCondition) => {
  // Si no hay condición de victoria, permitir por defecto
  if (!victoryCondition || !victoryCondition.type) {
    return true;
  }
  
  const habits = gameData.habits || [];
  const tasks = gameData.tasks || [];
  const playerLevel = gameData.user?.level || 1;
  
  switch (victoryCondition.type) {
    case 'complete_tasks':
      const completedTasks = tasks.filter(t => t.completed).length;
      return completedTasks >= victoryCondition.requirement;
      
    case 'focus_habits':
      const focusHabits = habits.filter(h => 
        h.name.toLowerCase().includes('meditar') || 
        h.name.toLowerCase().includes('focus') ||
        h.name.toLowerCase().includes('concentración')
      );
      const totalFocusCompletions = focusHabits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);
      return totalFocusCompletions >= victoryCondition.requirement;
      
    case 'exercise_streak':
      const exerciseHabits = habits.filter(h => 
        h.name.toLowerCase().includes('ejercicio') || 
        h.name.toLowerCase().includes('gimnasio') ||
        h.name.toLowerCase().includes('correr')
      );
      return exerciseHabits.some(h => (h.streak || 0) >= victoryCondition.requirement);
      
    case 'none':
    default:
      return true; // Por defecto permitir
  }
};



  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Boss Battles</h2>
        <p className="text-gray-600">Enfrenta tus malos hábitos y vence a tus demonios internos</p>
      </div>

      {/* Active Challenge */}
      {activeChallenge && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-purple-800">{activeChallenge.title}</h3>
              <p className="text-purple-600">{activeChallenge.description}</p>
            </div>
            <div className="text-4xl">{activeChallenge.icon}</div>
          </div>

          {/* Challenge Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Timer Display */}
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <div className="text-center">
                {/* Pomodoro Interface */}
                {showPomodoro && activeChallenge?.challenge?.type === 'pomodoro' ? (
                  <div>
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pomodoroPhase === 'work' ? 'bg-red-100 text-red-700' :
                        pomodoroPhase === 'short_break' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {pomodoroPhase === 'work' ? '🍅 Tiempo de Trabajo' :
                         pomodoroPhase === 'short_break' ? '☕ Descanso Corto' :
                         '🌟 Descanso Largo'}
                      </span>
                    </div>
                    <div className="text-6xl font-bold mb-2">
                      {formatTime(pomodoroConfig[pomodoroPhase] - elapsedTime)}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Sesión {pomodoroSession} • {pomodoroSessionsCompleted} completadas
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          pomodoroPhase === 'work' ? 'bg-red-500' :
                          pomodoroPhase === 'short_break' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${(elapsedTime / pomodoroConfig[pomodoroPhase]) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-center gap-2 text-xs text-gray-500">
                      <span>25min</span>
                      <span>→</span>
                      <span>5min</span>
                      <span>→</span>
                      <span>25min</span>
                      <span>→</span>
                      <span>5min</span>
                      <span>→</span>
                      <span>25min</span>
                      <span>→</span>
                      <span>5min</span>
                      <span>→</span>
                      <span>15min</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {formatTime(elapsedTime)}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Tiempo transcurrido / {activeChallenge.challenge.duration}:00
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (elapsedTime / (activeChallenge.challenge.duration * 60)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Details */}
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4">Detalles del Desafío</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">
                    {activeChallenge.challenge.type === 'pomodoro' ? '🍅 Sesión Pomodoro' :
                     activeChallenge.challenge.type === 'deep_focus' ? '🎯 Trabajo Profundo' :
                     activeChallenge.challenge.type === 'exercise' ? '🏃 Ejercicio Físico' :
                     activeChallenge.challenge.type === 'imperfect_action' ? '⚡ Acción Imperfecta' :
                     activeChallenge.challenge.type === 'new_challenge' ? '🎪 Nuevo Desafío' :
                     activeChallenge.challenge.type === 'digital_detox' ? '🔥 Detox Digital' :
                     activeChallenge.challenge.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dificultad:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeChallenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    activeChallenge.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                    activeChallenge.difficulty === 'extreme' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {activeChallenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Recompensa:</span>
                  <span className="font-medium">+{activeChallenge.rewards.xp} XP, +{activeChallenge.rewards.coins} coins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Progress */}
          <div className="bg-white rounded-lg p-4 border border-purple-200 mb-6">
            <h4 className="font-semibold text-purple-800 mb-3">Progreso del Desafío</h4>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                {activeChallenge.challenge.description}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm text-gray-600">
                  Estado: <span className={`font-medium ${isTimerRunning ? 'text-green-600' : 'text-gray-500'}`}>
                    {isTimerRunning ? '⏳ En progreso' : challengeResult ? (challengeResult === 'victory' ? '✅ Completado' : '❌ Fallido') : '⏸️ Pausado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Actions */}
          {challengeResult ? (
            <div className="text-center space-y-4">
              {challengeResult === 'victory' ? (
                <div>
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-green-600 mb-2">¡Desafío Completado!</h4>
                  <p className="text-gray-600 mb-4">
                    Has completado el desafío contra {activeChallenge.title} y ganado +{activeChallenge.rewards.xp} XP y +{activeChallenge.rewards.coins} coins
                  </p>
                </div>
              ) : (
                <div>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-red-600 mb-2">Desafío No Completado</h4>
                  <p className="text-gray-600 mb-4">
                    No has completado el desafío. Intenta de nuevo cuando estés más preparado
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Salir
                </button>
                {challengeResult === 'defeat' && (
                  <button
                    onClick={() => startChallenge(activeChallenge.id)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Challenge Controls */}
              <div className="flex gap-3 justify-center">
                {isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    ⏸️ Pausar
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ▶️ Reanudar
                  </button>
                )}
                <button
                  onClick={() => completeChallenge(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Abandonar
                </button>
                <button
                  onClick={() => completeChallenge(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Completar Manualmente
                </button>
              </div>

              {/* Challenge Log */}
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm">
                {challengeLog.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Available Bosses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(bossBattles).map(boss => {
          const isUnlocked = unlockedBosses.includes(boss.id);
          const isDefeated = gameData.defeatedBosses?.includes(boss.id);
          const playerLevel = gameData.user?.level || 1;
          const playerStats = gameData.user || {};
          const dynamicBoss = calculateDynamicBoss(boss, playerLevel, playerStats);
          const victoryCondition = getVictoryCondition(boss.id, playerLevel);
          const canBattle = isUnlocked && checkBattleCondition(boss.id, victoryCondition);
          
          return (
            <div 
              key={boss.id}
              className={`relative rounded-xl p-6 border-2 transition-all ${
                isDefeated ? 'bg-gray-50 border-gray-200 opacity-75' :
                isUnlocked ? 'bg-white border-red-200 hover:border-red-400 hover:shadow-lg' :
                'bg-gray-100 border-gray-200 opacity-50'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {!isUnlocked && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                    <Lock className="w-3 h-3" />
                    Bloqueado
                  </div>
                )}
                {isDefeated && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Derrotado
                  </div>
                )}
                {isUnlocked && !isDefeated && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Disponible
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">{boss.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{boss.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{boss.description}</p>
                
                {/* Challenge Stats */}
                <div className="flex items-center justify-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{dynamicBoss.challenge.duration}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{dynamicBoss.rewards.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-blue-500" />
                    <span>{dynamicBoss.rewards.coins} coins</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                {isUnlocked && (
                  <div className="mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dynamicBoss.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      dynamicBoss.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                      dynamicBoss.difficulty === 'extreme' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {dynamicBoss.difficulty === 'medium' ? '⭐⭐ Medio' : 
                       dynamicBoss.difficulty === 'hard' ? '⭐⭐⭐ Difícil' : 
                       dynamicBoss.difficulty === 'extreme' ? '⭐⭐⭐⭐ Extremo' :
                       '⭐⭐⭐⭐⭐ Legendario'}
                    </span>
                  </div>
                )}

                {/* Challenge Description */}
                {isUnlocked && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Desafío:</p>
                    <p className="text-xs font-medium text-gray-700">{dynamicBoss.challenge.description}</p>
                  </div>
                )}

                {/* Challenge Type */}
                {isUnlocked && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Tipo:</p>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {dynamicBoss.challenge.type === 'pomodoro' ? '🍅 Sesión Pomodoro' :
                       dynamicBoss.challenge.type === 'deep_focus' ? '🎯 Trabajo Profundo' :
                       dynamicBoss.challenge.type === 'exercise' ? '🏃 Ejercicio Físico' :
                       dynamicBoss.challenge.type === 'imperfect_action' ? '⚡ Acción Imperfecta' :
                       dynamicBoss.challenge.type === 'new_challenge' ? '🎪 Nuevo Desafío' :
                       dynamicBoss.challenge.type === 'digital_detox' ? '🔥 Detox Digital' :
                       dynamicBoss.challenge.type.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                {isUnlocked && !isDefeated && (
                  <button
                    onClick={() => {
                      if (canBattle) {
                        startChallenge(boss.id);
                      } else {
                        // Iniciar desafío directamente sin cumplir requisitos previos
                        const baseBoss = bossBattles[boss.id];
                        const playerLevel = gameData.user?.level || 1;
                        const playerStats = gameData.user || {};
                        const dynamicBoss = calculateDynamicBoss(baseBoss, playerLevel, playerStats);
                        
                        setActiveChallenge(dynamicBoss);
                        setChallengeResult(null);
                        setChallengeLog([
                          `🎯 Desafío contra ${baseBoss.title} iniciado!`,
                          `📊 Dificultad: ${dynamicBoss.difficulty} (Nivel ${playerLevel})`,
                          `⏱️ Duración: ${dynamicBoss.challenge.duration} minutos`,
                          `🎪 Objetivo: ${dynamicBoss.challenge.description}`
                        ]);
                        
                        // Iniciar pomodoro directamente
                        if (dynamicBoss.challenge.type === 'pomodoro') {
                          resetPomodoro();
                          setShowPomodoro(true);
                          setIsTimerRunning(true);
                          setChallengeStartTime(Date.now());
                        } else {
                          setChallengeStartTime(Date.now());
                          setElapsedTime(0);
                          setIsTimerRunning(true);
                        }
                        
                        addNotification(`🍅 Desafío ${baseBoss.title} iniciado. ¡Completa el pomodoro!`, 'success');
                      }
                    }}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      canBattle
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {canBattle ? '🎯 Iniciar Desafío' : '📋 Cumple requisito'}
                  </button>
                )}
                
                {!isUnlocked && (
                  <div className="text-xs text-gray-500 text-center">
                    {boss.id === 'distraction' && 'Desbloquea con hábitos de focus'}
                    {boss.id === 'laziness' && 'Desbloquea con hábitos de ejercicio'}
                    {boss.id === 'perfectionism' && 'Desbloquea con 5+ tareas'}
                    {boss.id === 'fear' && 'Desbloquea en nivel 3+'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Consejos para Batallas</h3>
        </div>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Cada boss tiene debilidades específicas - úsalas a tu favor</li>
          <li>• Los ataques fuertes hacen más daño pero pueden dejar vulnerable</li>
          <li>• Completa las condiciones especiales para ventaja adicional</li>
          <li>• Los bosses derrotados dan recompensas permanentes</li>
          <li>• Algunos bosses se desbloquean según tu progreso</li>
        </ul>
      </div>
    </div>
  );
}

export default BossBattles;
