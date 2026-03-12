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

const bossTips = {
  procrastination: [
    "• Divide la tarea principal en micro-pasos de 5 minutos",
    "• Aplica la regla de los 2 minutos: si toma menos de eso, hazlo ya",
    "• Elimina las fricciones preparando tu espacio de trabajo previamente",
    "• Celebra los pequeños avances en lugar de esperar al resultado final",
    "• Visualiza las consecuencias negativas de no hacer la tarea hoy"
  ],
  distraction: [
    "• Guarda tu teléfono en otra habitación",
    "• Usa bloqueadores de sitios web o aplicaciones",
    "• Desactiva todas las notificaciones no esenciales",
    "• Usa ruido blanco o música instrumental para enfocarte",
    "• Mantén un block de notas física para anotar ideas sin perder foco"
  ],
  laziness: [
    "• Comprométete a solo 5 minutos de actividad",
    "• Prepara tu ropa deportiva o equipo desde temprano",
    "• Pon música energética para romper la inercia",
    "• Empieza siempre con estiramientos simples",
    "• Asocia el ejercicio con algo que disfrutes como un podcast"
  ],
  perfectionism: [
    "• Fija límites de tiempo estrictos para cada tarea",
    "• Enfócate en la regla 80/20 (el 20% del esfuerzo da el 80% del resultado)",
    "• Acepta que el primer borrador siempre será imperfecto",
    "• Define claramente qué significa 'terminado' antes de empezar",
    "• Recuerda siempre que hecho es mejor que perfecto"
  ],
  fear: [
    "• Pregúntate: ¿Qué es lo peor que podría pasar en realidad?",
    "• Define un 'plan B' para reducir la ansiedad y el estrés",
    "• Recuerda fracasos pasados de los que lograste aprender",
    "• Cambia el enfoque de 'no fallar' a 'aprender algo nuevo'",
    "• Acostúmbrate a estar incómodo en situaciones controladas"
  ],
  burnout: [
    "• Desconéctate por completo de todas las pantallas",
    "• Establece límites claros entre tu momento de trabajo y descanso",
    "• Prioriza un buen descanso sobre cualquier otra actividad productiva",
    "• Dedica al menos 5 minutos para practicar la respiración profunda",
    "• Aprende a decir que no a nuevas e irrelevantes responsabilidades"
  ]
};

function BossBattles({ addNotification }) {
  const { gameData, updateGameData } = useData();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [selectedBossId, setSelectedBossId] = useState(null);
  const [animatingBossId, setAnimatingBossId] = useState(null);
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${pomodoroPhase === 'work' ? 'bg-red-100 text-red-700' :
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
                        className={`h-3 rounded-full transition-all duration-1000 ${pomodoroPhase === 'work' ? 'bg-red-500' :
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeChallenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
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


      {/* ─── FEATURED PANEL: visible when a boss is selected ─── */}
      <div className={`transition-all duration-500 ${selectedBossId ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
        {selectedBossId && (() => {
          const boss = bossBattles[selectedBossId];
          const isDefeated = gameData.defeatedBosses?.includes(boss.id);
          const playerLevel = gameData.user?.level || 1;
          const playerStats = gameData.user || {};
          const dynamicBoss = calculateDynamicBoss(boss, playerLevel, playerStats);
          const victoryCondition = getVictoryCondition(boss.id, playerLevel);
          const canBattle = unlockedBosses.includes(boss.id) && checkBattleCondition(boss.id, victoryCondition);

          return (
            <div key={selectedBossId} className="flex flex-col lg:flex-row gap-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-300 rounded-2xl p-5 shadow-lg boss-featured-in">
              {/* Selected Boss Card */}
              <div
                onClick={() => {
                  if (activeChallenge) {
                    addNotification('Ya tienes una batalla contra un boss en progreso', 'warning');
                    return;
                  }
                  setSelectedBossId(null);
                }}
                className={`lg:w-64 flex-shrink-0 bg-white rounded-xl p-5 border-2 border-purple-400 shadow-md ${activeChallenge ? 'cursor-not-allowed' : 'cursor-pointer hover:border-purple-500'} transition-all relative`}
                title="Haz clic para deseleccionar"
              >
                <div className="absolute top-3 right-3 text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  ✓ Seleccionado
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">{boss.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{boss.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{boss.description}</p>

                  <div className="flex items-center justify-center gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />
                      <span>{dynamicBoss.challenge.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span>{dynamicBoss.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-blue-500" />
                      <span>{dynamicBoss.rewards.coins} coins</span>
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${dynamicBoss.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    dynamicBoss.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                      dynamicBoss.difficulty === 'extreme' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                    }`}>
                    {dynamicBoss.difficulty === 'medium' ? '⭐⭐ Medio' :
                      dynamicBoss.difficulty === 'hard' ? '⭐⭐⭐ Difícil' :
                        dynamicBoss.difficulty === 'extreme' ? '⭐⭐⭐⭐ Extremo' :
                          '⭐⭐⭐⭐⭐ Legendario'}
                  </span>

                  {!isDefeated && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canBattle) {
                          startChallenge(boss.id);
                        } else {
                          const dBoss = calculateDynamicBoss(boss, playerLevel, playerStats);
                          setActiveChallenge(dBoss);
                          setChallengeResult(null);
                          setChallengeLog([
                            `🎯 Desafío contra ${boss.title} iniciado!`,
                            `📊 Dificultad: ${dBoss.difficulty} (Nivel ${playerLevel})`,
                            `⏱️ Duración: ${dBoss.challenge.duration} minutos`,
                            `🎪 Objetivo: ${dBoss.challenge.description}`
                          ]);
                          if (dBoss.challenge.type === 'pomodoro') {
                            resetPomodoro();
                            setShowPomodoro(true);
                            setIsTimerRunning(true);
                            setChallengeStartTime(Date.now());
                          } else {
                            setChallengeStartTime(Date.now());
                            setElapsedTime(0);
                            setIsTimerRunning(true);
                          }
                          addNotification(`🚀 Desafío ${boss.title} iniciado!`, 'success');
                        }
                      }}
                      className={`w-full mt-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${canBattle
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                      {canBattle ? '🎯 Iniciar Desafío' : '📋 Cumple requisito'}
                    </button>
                  )}
                  {isDefeated && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-green-700 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4" /> Ya derrotado
                    </div>
                  )}
                </div>
              </div>

              {/* Strategy Tips */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Estrategia de batalla</p>
                    <h4 className="text-xl font-bold text-purple-900">
                      Cómo vencer a <span className="text-purple-600">{boss.title}</span>
                    </h4>
                  </div>
                </div>
                {bossTips[boss.id] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    {bossTips[boss.id].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white bg-opacity-80 rounded-xl p-3 border border-purple-100">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-purple-800 leading-snug">{tip.replace('• ', '')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─── REMAINING CHALLENGES GRID ─── */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">
          {selectedBossId ? 'Otros desafíos disponibles:' : 'Selecciona un desafío:'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(bossBattles)
            .filter(boss => boss.id !== selectedBossId)
            .map(boss => {
              const isUnlocked = unlockedBosses.includes(boss.id);
              const isDefeated = gameData.defeatedBosses?.includes(boss.id);
              const playerLevel = gameData.user?.level || 1;
              const playerStats = gameData.user || {};
              const dynamicBoss = calculateDynamicBoss(boss, playerLevel, playerStats);

              return (
                <div
                  key={boss.id}
                  onClick={() => {
                    if (activeChallenge) {
                      addNotification('Ya tienes una batalla contra un boss en progreso', 'warning');
                      return;
                    }
                    if (isUnlocked && animatingBossId === null) {
                      setAnimatingBossId(boss.id);
                      setTimeout(() => {
                        setSelectedBossId(boss.id);
                        setAnimatingBossId(null);
                      }, 380);
                    }
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${animatingBossId === boss.id
                    ? 'boss-card-fly'
                    : isDefeated
                      ? `bg-gray-50 border-gray-200 opacity-75 grayscale ${activeChallenge ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`
                      : isUnlocked
                        ? `bg-white border-red-200 hover:border-purple-400 hover:shadow-lg ${activeChallenge ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-50'}`
                        : 'bg-white border-gray-300 cursor-not-allowed'
                    }`}
                >
                  {/* Dark lock overlay — only for locked bosses */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 rounded-xl z-10 flex flex-col items-center justify-center gap-3"
                      style={{ background: 'rgba(10, 10, 20, 0.72)', backdropFilter: 'blur(1.5px)' }}>
                      {/* Lock icon */}
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-10 border border-white border-opacity-25 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      {/* Unlock condition */}
                      <div className="text-center px-4">
                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Bloqueado</p>
                        <p className="text-white text-sm font-semibold leading-snug">
                          {boss.id === 'distraction' && '🎯 Completa hábitos de focus'}
                          {boss.id === 'laziness' && '🏃 Completa hábitos de ejercicio'}
                          {boss.id === 'perfectionism' && '✅ Completa 5+ tareas'}
                          {boss.id === 'fear' && '⭐ Alcanza el nivel 3'}
                          {boss.id === 'burnout' && '🏆 Completa otros desafíos primero'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card content (always rendered, overlay sits on top when locked) */}
                  <div className="p-5">
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      {isDefeated && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" /> Derrotado
                        </div>
                      )}
                      {isUnlocked && !isDefeated && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                          <AlertTriangle className="w-3 h-3" /> Disponible
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="text-4xl mb-2">{boss.icon}</div>
                      <h3 className="text-base font-bold text-gray-800 mb-1">{boss.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{boss.description}</p>

                      <div className="flex items-center justify-center gap-3 mb-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-500" />
                          <span>{dynamicBoss.challenge.duration}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span>{dynamicBoss.rewards.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-blue-500" />
                          <span>{dynamicBoss.rewards.coins} coins</span>
                        </div>
                      </div>

                      {isUnlocked && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dynamicBoss.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          dynamicBoss.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                            dynamicBoss.difficulty === 'extreme' ? 'bg-red-100 text-red-700' :
                              'bg-purple-100 text-purple-700'
                          }`}>
                          {dynamicBoss.difficulty === 'medium' ? '⭐⭐ Medio' :
                            dynamicBoss.difficulty === 'hard' ? '⭐⭐⭐ Difícil' :
                              dynamicBoss.difficulty === 'extreme' ? '⭐⭐⭐⭐ Extremo' :
                                '⭐⭐⭐⭐⭐ Legendario'}
                        </span>
                      )}

                      {isUnlocked && !isDefeated && (
                        <p className="text-xs text-purple-500 mt-2 font-medium">
                          ↑ Pulsa para seleccionar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* General tips hint — shown only when nothing is selected */}
      {
        !selectedBossId && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Consejos para Batallas:</span> Pulsa cualquier desafío desbloqueado para ver la estrategia de batalla específica y el botón de inicio.
              </p>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default BossBattles;
