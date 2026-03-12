import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { allAchievements } from '../components/Achievements';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialGameData = {
  user: {
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    totalTasksCompleted: 0,
    totalHabitsCompleted: 0,
    lastActiveDate: new Date().toISOString(),
    title: 'Principiante',
    unlockedFeatures: ['basic_habits', 'basic_tasks'],
    rank: 'beginner',
    // Sistema de HP (vida)
    hp: 100,
    maxHp: 100,
    isDead: false,
    lastHpDecayDate: null,
    lastHabitResetDate: null,
    // Sistema de personalización
    avatar: {
      style: 'adventurer',
      seed: 'default',
      backgroundColor: 'b6e3f4',
      accessories: []
    },
    theme: 'light',
    accentColor: 'purple'
  },
  tasks: [],
  habits: [],
  rewards: [],
  inventory: [], // items comprados en la tienda RPG
  badHabits: [], // malos hábitos a "vencer"
  lifeAreas: [
    { id: 'health', name: 'Salud', progress: 0, objectives: [] },
    { id: 'career', name: 'Carrera', progress: 0, objectives: [] },
    { id: 'relationships', name: 'Relaciones', progress: 0, objectives: [] },
    { id: 'personal', name: 'Personal', progress: 0, objectives: [] },
    { id: 'finances', name: 'Finanzas', progress: 0, objectives: [] },
    { id: 'home', name: 'Hogar', progress: 0, objectives: [] }
  ],
  calendarEvents: [],
  achievements: [],
  notificationHistory: [],
  defeatedBosses: [],
  collections: [],
  quests: {
    daily: [],
    weekly: [],
    special: []
  },
  analytics: {
    patterns: {},
    productivity: {},
    predictions: []
  }
};

export const DataProvider = ({ children, authUser }) => {
  // authUser viene de AuthContext: { uid, displayName, email, photoURL }
  const [gameData, setGameData] = useState(() => {
    const savedData = localStorage.getItem('gameData');
    return savedData ? JSON.parse(savedData) : initialGameData;
  });
  const [firestoreLoading, setFirestoreLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Flag to prevent saving local data to firebase before loading
  const lastSavedRef = useRef(null);

  // ── Cargar datos desde Firestore cuando el usuario hace login ──────────
  useEffect(() => {
    if (!authUser?.uid) {
      setIsInitialized(false);
      return;
    }
    setFirestoreLoading(true);
    const userDocRef = doc(db, 'users', authUser.uid);
    getDoc(userDocRef).then((snap) => {
      if (snap.exists()) {
        const cloudData = snap.data();
        setGameData(prev => ({
          ...initialGameData,
          ...cloudData,
          // Merge user info from Google profile
          user: {
            ...initialGameData.user,
            ...cloudData.user,
            googleName: authUser.displayName,
            googleEmail: authUser.email,
            googlePhoto: authUser.photoURL,
            avatar: {
              ...initialGameData.user.avatar,
              ...(cloudData.user?.avatar || {}),
              // Si no hay seed en la nube, usar uid como seed
              seed: cloudData.user?.avatar?.seed || authUser.uid.slice(0, 8)
            }
          }
        }));
      } else {
        // Primera vez en Firestore: mantener el progreso local (prev) en lugar de initialGameData
        setGameData(prev => {
          const freshData = {
            ...prev,
            user: {
              ...prev.user,
              googleName: authUser.displayName,
              googleEmail: authUser.email,
              googlePhoto: authUser.photoURL,
              avatar: {
                ...(prev.user?.avatar || initialGameData.user.avatar),
                seed: authUser.uid.slice(0, 8)
              }
            }
          };
          // Initialize in DB immediately, stripping any undefineds
          const dataToSave = JSON.parse(JSON.stringify(freshData));
          setDoc(userDocRef, dataToSave).catch(console.error);
          return freshData;
        });
      }
      setFirestoreLoading(false);
      setIsInitialized(true);
      addNotification('Sincronización inicial exitosa', 'success');
    }).catch((err) => {
      console.error('Error loading Firestore data:', err);
      setFirestoreLoading(false);
      setIsInitialized(true); // Always initialize to allow normal operation even on error
      if (err.message && err.message.toLowerCase().includes('permission')) {
        addNotification('❌ Error Firebase: Permisos denegados. Posiblemente las reglas de tu base de datos expiraron.', 'error');
      } else {
        addNotification('❌ Error al cargar tu progreso de la nube', 'error');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid]);

  // ── Guardar en Firestore + localStorage con debounce ───────────────────
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    // Siempre guardar en localStorage como cache
    localStorage.setItem('gameData', JSON.stringify(gameData));

    // Solo guardar en Firestore si hay usuario autenticado, datos cambiaron, Y ya terminó de cargar la DB inicialmente
    if (!authUser?.uid || firestoreLoading || !isInitialized) return;

    const serialized = JSON.stringify(gameData);
    if (serialized === lastSavedRef.current) return;

    // Debounce: esperar 1.5s sin cambios antes de escribir
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      lastSavedRef.current = serialized;
      const userDocRef = doc(db, 'users', authUser.uid);
      // Firebase throws an error if any nested field is 'undefined'.
      // By using JSON.parse(serialized), we safely strip all undefined values.
      const dataToSave = JSON.parse(serialized);
      setDoc(userDocRef, dataToSave, { merge: false })
        .then(() => {
          console.log("Guardo en Firebase correcto");
        })
        .catch(err => {
          console.error("Firebase sync error:", err);
          if (err.message && err.message.toLowerCase().includes('permission')) {
            addNotification('❌ Error de Guardado: No tienes permisos en Firestore.', 'error');
          } else {
            addNotification('❌ Falló el respaldo en la nube', 'error');
          }
        });
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData, authUser?.uid, firestoreLoading, isInitialized]);

  // Calcular nivel basado en XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  // Actualizar datos del juego
  const updateGameData = (updates) => {
    setGameData(prevData => {
      // Si updates es una función, ejecutarla con el estado anterior
      const updatesToApply = typeof updates === 'function' ? updates(prevData) : updates;
      const newData = { ...prevData, ...updatesToApply };

      // Recalcular nivel si cambió el XP
      if (updatesToApply.user?.xp !== undefined) {
        newData.user.level = calculateLevel(updatesToApply.user.xp);
      }

      return newData;
    });
  };

  // Sistema de notificaciones (toasts en vivo)
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (message, type = 'info', subtitle = null) => {
    const id = Date.now() + Math.random();
    const timestamp = new Date().toISOString();
    const notification = { id, message, type, subtitle, timestamp, read: false };

    // Mostrar toast en vivo
    setNotifications(prev => [...prev, notification]);

    // Auto-eliminar toast después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);

    // Guardar en historial persistente
    setGameData(prev => ({
      ...prev,
      notificationHistory: [notification, ...(prev.notificationHistory || [])].slice(0, 100)
    }));
  };

  const markNotificationsRead = () => {
    setGameData(prev => ({
      ...prev,
      notificationHistory: (prev.notificationHistory || []).map(n => ({ ...n, read: true }))
    }));
  };

  const clearNotificationHistory = () => {
    setGameData(prev => ({ ...prev, notificationHistory: [] }));
  };

  // ─── Sistema de HP (vida del personaje) ───────────────────────────────────
  // Decay diario: si no hay actividad, pierde 15 HP por día
  useEffect(() => {
    if (!gameData || !gameData.user) return;
    const today = new Date().toDateString();
    const lastDecay = gameData.user.lastHpDecayDate;
    if (lastDecay === today) return; // ya se procesó hoy

    const hadActivityToday = (
      gameData.tasks.some(t => t.completedAt && new Date(t.completedAt).toDateString() === today) ||
      gameData.habits.some(h => h.completedToday)
    );

    if (!hadActivityToday) {
      setGameData(prev => {
        const currentHp = prev.user.hp ?? 100;
        const newHp = Math.max(0, currentHp - 15);
        const isDead = newHp === 0;
        return {
          ...prev,
          user: {
            ...prev.user,
            hp: newHp,
            isDead,
            lastHpDecayDate: today
          }
        };
      });
      if ((gameData.user.hp ?? 100) > 15) {
        addNotification('💔 ¡Perdiste 15 HP por inactividad! Completa tareas o hábitos para recuperar vida', 'warning');
      }
    } else {
      // Actividad = guardar que ya pasó decay hoy sin penalidad
      setGameData(prev => ({
        ...prev,
        user: { ...prev.user, lastHpDecayDate: today }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData.user?.lastHpDecayDate]);

  // ── Reinicio diario de hábitos: asegurar que los hábitos con frecuencia 'Diario' se reinicien cada día
  useEffect(() => {
    if (!gameData) return;
    const today = new Date().toDateString();
    const lastReset = gameData.user?.lastHabitResetDate;
    if (lastReset === today) return; // ya reiniciado hoy

    const currentHabits = gameData.habits || [];
    const newHabits = currentHabits.map(h => {
      // Solo resetear flags diarios para hábitos con frecuencia 'Diario'
      if (h.frequency === 'Diario') {
        // Evitar cambiar otras propiedades
        return { ...h, completedToday: false, earnedXP: 0, earnedCoins: 0 };
      }
      return h;
    });

    // Actualizar la fecha de reinicio y persistir cambios
    setGameData(prev => ({
      ...prev,
      habits: newHabits,
      user: { ...prev.user, lastHabitResetDate: today }
    }));

    addNotification('🔄 Reinicio diario de hábitos ejecutado', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData?.habits, gameData?.user?.lastHabitResetDate]);

  // Restaurar HP al completar tareas/hábitos (máx +5 HP por acción)
  const healHp = (amount = 5) => {
    setGameData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        hp: Math.min(prev.user.maxHp ?? 100, (prev.user.hp ?? 100) + amount),
        isDead: false
      }
    }));
  };

  // Usar una poción del inventario
  const usePotion = (inventoryItemId) => {
    setGameData(prev => {
      const item = (prev.inventory || []).find(i => i.id === inventoryItemId);
      if (!item) return prev;

      let userUpdates = {};
      if (item.effect === 'heal') {
        userUpdates = {
          hp: Math.min(prev.user.maxHp ?? 100, (prev.user.hp ?? 0) + item.hpRestore),
          isDead: false
        };
      } else if (item.effect === 'revive') {
        userUpdates = { hp: prev.user.maxHp ?? 100, isDead: false };
      } else if (item.effect === 'shield') {
        userUpdates = { hpShieldDate: new Date().toDateString() };
      }

      // Quitar item de inventario (consumible)
      const newInventory = (prev.inventory || []).filter(i => i.id !== inventoryItemId);
      return {
        ...prev,
        inventory: newInventory,
        user: { ...prev.user, ...userUpdates }
      };
    });
    addNotification('✨ ¡Poción usada! Tu personaje ha sido restaurado', 'success');
  };

  // Comprar item de la tienda RPG
  const SHOP_ITEMS = [
    { shopId: 'potion_small', name: 'Poción de Vida', icon: '🧪', cost: 150, effect: 'heal', hpRestore: 25, description: 'Restaura 25 HP' },
    { shopId: 'potion_revival', name: 'Poción de Revival', icon: '💊', cost: 500, effect: 'revive', hpRestore: 100, description: 'Revive con HP completo' },
    { shopId: 'xp_boost', name: 'XP Booster 24h', icon: '⚡', cost: 300, effect: 'xp_boost', description: '+50% XP por 24 horas' },
    { shopId: 'shield', name: 'Escudo del Día', icon: '🛡️', cost: 200, effect: 'shield', description: 'Evita pérdida de HP hoy' },
  ];

  const buyItem = (shopId) => {
    const shopItem = SHOP_ITEMS.find(i => i.shopId === shopId);
    if (!shopItem) return;

    setGameData(prev => {
      if ((prev.user.coins || 0) < shopItem.cost) return prev; // no alcanza
      const inventoryItem = {
        ...shopItem,
        id: Date.now() + Math.random(),
        purchasedAt: new Date().toISOString()
      };
      return {
        ...prev,
        inventory: [...(prev.inventory || []), inventoryItem],
        user: { ...prev.user, coins: prev.user.coins - shopItem.cost }
      };
    });
    addNotification(`🛒 ¡"${shopItem.name}" comprado y guardado en tu inventario!`, 'success');
  };

  // ─── Sistema de Malos Hábitos ─────────────────────────────────────────────
  const addBadHabit = (habit) => {
    const newBadHabit = {
      id: Date.now(),
      name: habit.name,
      category: habit.category || 'personal',
      icon: habit.icon || '👿',
      daysClean: 0,
      startDate: new Date().toISOString(),
      lastRelapsed: null,
      milestones: [] // [7, 30, 100] completados
    };
    setGameData(prev => ({
      ...prev,
      badHabits: [...(prev.badHabits || []), newBadHabit]
    }));
  };

  const relapseBadHabit = (badHabitId) => {
    setGameData(prev => {
      const newBadHabits = (prev.badHabits || []).map(h => {
        if (h.id !== badHabitId) return h;
        return {
          ...h,
          daysClean: 0,
          lastRelapsed: new Date().toISOString()
        };
      });
      return {
        ...prev,
        badHabits: newBadHabits,
        user: {
          ...prev.user,
          hp: Math.max(0, (prev.user.hp ?? 100) - 10),
          isDead: Math.max(0, (prev.user.hp ?? 100) - 10) === 0
        }
      };
    });
    addNotification('💀 ¡Recaída! -10 HP. ¡Pero puedes volver a levantarte!', 'error');
  };

  const updateBadHabitDays = () => {
    // Actualiza los días limpios basado en la fecha de inicio / última recaída
    setGameData(prev => {
      const today = new Date();
      const newBadHabits = (prev.badHabits || []).map(h => {
        const since = h.lastRelapsed ? new Date(h.lastRelapsed) : new Date(h.startDate);
        const daysClean = Math.floor((today - since) / (1000 * 60 * 60 * 24));
        // Checar milestones
        const newMilestones = [...(h.milestones || [])];
        let xpBonus = 0;
        [7, 30, 100].forEach(milestone => {
          if (daysClean >= milestone && !newMilestones.includes(milestone)) {
            newMilestones.push(milestone);
            xpBonus += milestone === 7 ? 50 : milestone === 30 ? 150 : 500;
          }
        });
        if (xpBonus > 0) {
          setTimeout(() => addNotification(`🏆 ¡${daysClean} días limpio de "${h.name}"! +${xpBonus} XP`, 'achievement'), 100);
        }
        return { ...h, daysClean, milestones: newMilestones, pendingXP: xpBonus };
      });
      return { ...prev, badHabits: newBadHabits };
    });
  };

  const deleteBadHabit = (badHabitId) => {
    setGameData(prev => ({
      ...prev,
      badHabits: (prev.badHabits || []).filter(h => h.id !== badHabitId)
    }));
  };

  // Efecto global para evaluar y desbloquear logros automáticamente
  useEffect(() => {
    if (!gameData || !gameData.user) return;

    const unlocked = new Set();
    const { user, tasks, habits, lifeAreas } = gameData;

    // Logros de Racha
    if (user.streak >= 1) unlocked.add('first_day');
    if (user.streak >= 7) unlocked.add('week_warrior');
    if (user.streak >= 30) unlocked.add('month_master');
    if (user.streak >= 100) unlocked.add('century_club');

    // Logros de Tareas
    const completedTasks = tasks?.filter(t => t.completed).length || 0;
    if (completedTasks >= 10) unlocked.add('task_rookie');
    if (completedTasks >= 50) unlocked.add('task_expert');
    if (completedTasks >= 100) unlocked.add('task_master');
    if (completedTasks >= 500) unlocked.add('task_legend');

    // Logros de Hábitos
    const numHabits = habits?.length || 0;
    if (numHabits >= 5) unlocked.add('habit_starter');
    if (numHabits >= 15) unlocked.add('habit_builder');
    if (numHabits >= 30) unlocked.add('habit_master');

    // Logros de Áreas de Vida
    lifeAreas?.forEach(area => {
      if (area.progress >= 80) {
        if (area.id === 'health') unlocked.add('health_hero');
        if (area.id === 'career') unlocked.add('career_champion');
        if (area.id === 'relationships') unlocked.add('relationship_guru');
        if (area.id === 'personal') unlocked.add('personal_sage');
        if (area.id === 'finances') unlocked.add('financial_wizard');
        if (area.id === 'home') unlocked.add('home_master');
      }
    });

    // Logros de Nivel
    if (user.level >= 10) unlocked.add('level_10');
    if (user.level >= 25) unlocked.add('level_25');
    if (user.level >= 50) unlocked.add('level_50');

    // Especiales
    const allAreasAbove60 = lifeAreas?.length > 0 && lifeAreas.every(area => area.progress >= 60);
    if (allAreasAbove60) unlocked.add('balanced_life');

    const newlyUnlockedIds = Array.from(unlocked).filter(id => !gameData.achievements?.includes(id));

    if (newlyUnlockedIds.length > 0) {
      // Diferir las notificaciones y recompensas para que no choquen con el ciclo de render actual
      setTimeout(() => {
        newlyUnlockedIds.forEach(achId => {
          let achData = null;
          Object.values(allAchievements).forEach(category => {
            if (category[achId]) achData = category[achId];
          });

          if (achData) {
            addNotification(`🏆 ¡Logro Desbloqueado: ${achData.name}!`, 'achievement', `+${achData.xp} XP · +${achData.coins} monedas`);
            // Otorgar las recompensas del logro con spread completo para no perder datos
            setGameData(prev => ({
              ...prev,
              user: {
                ...prev.user,
                xp: (prev.user.xp || 0) + achData.xp,
                coins: (prev.user.coins || 0) + achData.coins
              }
            }));
          }
        });
      }, 0);

      // Usamos updateGameData (directamente muta el estado de una manera controlada)
      setGameData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), ...newlyUnlockedIds]
      }));
    }
  }, [gameData.user.streak, gameData.tasks, gameData.habits, gameData.lifeAreas, gameData.user.level, gameData.achievements]);

  // Sistema de progreso de áreas de vida
  const updateLifeAreaProgress = (areaId, progressIncrease) => {
    setGameData(prevData => {
      const newData = { ...prevData };
      const areaIndex = newData.lifeAreas.findIndex(area => area.id === areaId);

      if (areaIndex !== -1) {
        const area = newData.lifeAreas[areaIndex];
        const oldProgress = area.progress;
        const newProgress = Math.min(100, oldProgress + progressIncrease);

        newData.lifeAreas[areaIndex] = {
          ...area,
          progress: newProgress,
          targetProgress: newProgress
        };

        // Verificar si se completaron milestones
        const oldLevel = Math.floor(oldProgress / 20) + 1;
        const newLevel = Math.floor(newProgress / 20) + 1;

        if (newLevel > oldLevel) {
          // Bonificación por subir de nivel en área de vida
          const milestoneBonus = newLevel * 50;
          newData.user.xp += milestoneBonus;
          newData.user.coins += Math.floor(milestoneBonus / 2);

          addNotification(`🎉 ¡${areaId === 'health' ? 'Salud' :
            areaId === 'career' ? 'Carrera' :
              areaId === 'relationships' ? 'Relaciones' :
                areaId === 'personal' ? 'Personal' :
                  areaId === 'finances' ? 'Finanzas' : 'Hogar'} 
            alcanzó nivel ${newLevel}! +${milestoneBonus} XP +${Math.floor(milestoneBonus / 2)} coins`, 'success');
        }
      }

      return newData;
    });
  };

  // Sistema para avanzar progreso de objetivos específicos
  const updateObjectiveProgress = (areaId, objectiveId, progressIncrease) => {
    setGameData(prevData => {
      const newData = { ...prevData };
      const areaIndex = newData.lifeAreas.findIndex(area => area.id === areaId);

      if (areaIndex !== -1) {
        const area = newData.lifeAreas[areaIndex];
        const objectiveProgress = area.objectiveProgress || {};
        const currentProgress = objectiveProgress[objectiveId] || 0;
        const newProgress = Math.min(100, currentProgress + progressIncrease);

        newData.lifeAreas[areaIndex] = {
          ...area,
          objectiveProgress: {
            ...objectiveProgress,
            [objectiveId]: newProgress
          }
        };

        // Si el objetivo llega a 100%, marcarlo como completado y dar recompensas
        if (newProgress >= 100 && !area.completedObjectives.includes(objectiveId)) {
          newData.lifeAreas[areaIndex] = {
            ...newData.lifeAreas[areaIndex],
            completedObjectives: [...area.completedObjectives, objectiveId]
          };

          // Recompensas por objetivo (mismo sistema para todas las áreas)
          const objectiveRewards = {
            1: { xp: 50, coins: 25 }, 2: { xp: 30, coins: 15 }, 3: { xp: 25, coins: 12 },
            4: { xp: 20, coins: 10 }, 5: { xp: 30, coins: 15 }
          };

          const reward = objectiveRewards[objectiveId];
          if (reward) {
            newData.user.xp = (newData.user.xp || 0) + reward.xp;
            newData.user.coins = (newData.user.coins || 0) + reward.coins;
          }

          // Actualizar progreso del área (10% por objetivo completado)
          updateLifeAreaProgress(areaId, 10);

          // Nombres de objetivos por área
          const areaObjectiveNames = {
            health: { 1: 'Perder peso', 2: 'Correr 10km', 3: 'Dormir 8h', 4: 'Beber 2L agua', 5: 'Meditar diario' },
            career: { 1: 'Promoción laboral', 2: 'Aprender inglés', 3: 'Proyecto liderado', 4: 'Certificación', 5: 'Networking' },
            relationships: { 1: 'Llamar a mamá', 2: 'Amigos nuevos', 3: 'Pareja feliz', 4: 'Familia unida', 5: 'Comunidad' },
            personal: { 1: 'Leer 12 libros', 2: 'Escribir diario', 3: 'Aprender guitarra', 4: 'Meditación', 5: 'Creatividad' },
            finances: { 1: 'Ahorro $1000', 2: 'Ingresos extra', 3: 'Invertir', 4: 'Presupuesto', 5: 'Deuda cero' },
            home: { 1: 'Casa ordenada', 2: 'Decorar habitación', 3: 'Jardín', 4: 'Reparaciones', 5: 'Minimalismo' }
          };

          const objectiveName = areaObjectiveNames[areaId]?.[objectiveId];
          if (objectiveName && reward) {
            addNotification(`🎯 ¡Objetivo "${objectiveName}" completado! +${reward.xp} XP +${reward.coins} coins`, 'success');
          }
        }
      }

      return newData;
    });
  };
  const completeLifeAreaObjective = (areaId, objectiveId) => {
    setGameData(prevData => {
      const newData = { ...prevData };
      const areaIndex = newData.lifeAreas.findIndex(area => area.id === areaId);

      if (areaIndex !== -1) {
        const area = newData.lifeAreas[areaIndex];
        const completedObjectives = area.completedObjectives || [];

        // Solo añadir si no está ya completado
        if (!completedObjectives.includes(objectiveId)) {
          newData.lifeAreas[areaIndex] = {
            ...area,
            completedObjectives: [...completedObjectives, objectiveId]
          };

          // Dar recompensas por completar objetivo
          const objectiveRewards = {
            1: { xp: 20, coins: 10 }, 2: { xp: 15, coins: 8 }, 3: { xp: 15, coins: 8 },
            4: { xp: 10, coins: 5 }, 5: { xp: 15, coins: 8 }, 6: { xp: 25, coins: 12 },
            7: { xp: 20, coins: 10 }, 8: { xp: 30, coins: 15 }, 9: { xp: 15, coins: 8 },
            10: { xp: 15, coins: 8 }, 11: { xp: 15, coins: 8 }, 12: { xp: 20, coins: 10 },
            13: { xp: 10, coins: 5 }, 14: { xp: 15, coins: 8 }, 15: { xp: 20, coins: 10 },
            16: { xp: 15, coins: 8 }, 17: { xp: 10, coins: 5 }, 18: { xp: 20, coins: 10 },
            19: { xp: 25, coins: 12 }, 20: { xp: 15, coins: 8 }, 21: { xp: 10, coins: 5 },
            22: { xp: 15, coins: 8 }, 23: { xp: 20, coins: 10 }, 24: { xp: 15, coins: 8 },
            25: { xp: 25, coins: 12 }, 26: { xp: 15, coins: 8 }, 27: { xp: 10, coins: 5 },
            28: { xp: 20, coins: 10 }, 29: { xp: 15, coins: 8 }, 30: { xp: 15, coins: 8 }
          };

          const reward = objectiveRewards[objectiveId];
          if (reward) {
            newData.user.xp += reward.xp;
            newData.user.coins += reward.coins;
          }

          // Actualizar progreso del área (8% por objetivo)
          updateLifeAreaProgress(areaId, 8);
        }
      }

      return newData;
    });
  };

  // Sistema de eventos de calendario
  const addCalendarEvent = (event) => {
    setGameData(prevData => ({
      ...prevData,
      calendarEvents: [...prevData.calendarEvents, { ...event, id: Date.now() }]
    }));
  };

  const removeCalendarEvent = (eventId) => {
    setGameData(prevData => ({
      ...prevData,
      calendarEvents: prevData.calendarEvents.filter(e => e.id !== eventId)
    }));
  };

  // Sistema de Rangos y Niveles
  const rankSystem = {
    levels: [
      { level: 1, title: 'Principiante', minXP: 0, maxXP: 100, icon: '🌱', color: 'from-green-400 to-emerald-600', unlockedFeatures: ['basic_habits', 'basic_tasks'] },
      { level: 2, title: 'Aprendiz', minXP: 100, maxXP: 250, icon: '📚', color: 'from-blue-400 to-indigo-600', unlockedFeatures: ['advanced_habits', 'habit_analytics'] },
      { level: 3, title: 'Experto', minXP: 250, maxXP: 500, icon: '⚡', color: 'from-purple-400 to-violet-600', unlockedFeatures: ['custom_rewards', 'weekly_challenges'] },
      { level: 4, title: 'Maestro', minXP: 500, maxXP: 1000, icon: '🏆', color: 'from-yellow-400 to-amber-600', unlockedFeatures: ['boss_battles', 'advanced_analytics'] },
      { level: 5, title: 'Leyenda', minXP: 1000, maxXP: Infinity, icon: '👑', color: 'from-red-400 to-rose-600', unlockedFeatures: ['all_features', 'premium_rewards'] }
    ]
  };

  const updateUserRank = (xp) => {
    const currentLevel = rankSystem.levels.find(level => xp >= level.minXP && xp < level.maxXP);
    if (currentLevel) {
      setGameData(prevData => ({
        ...prevData,
        user: {
          ...prevData.user,
          level: currentLevel.level,
          title: currentLevel.title,
          unlockedFeatures: currentLevel.unlockedFeatures
        }
      }));
    }
  };

  const checkLevelUp = (newXP) => {
    const currentLevel = rankSystem.levels.find(level => gameData.user.xp >= level.minXP && gameData.user.xp < level.maxXP);
    const newLevel = rankSystem.levels.find(level => newXP >= level.minXP && newXP < level.maxXP);

    if (newLevel && newLevel.level > (currentLevel?.level || 1)) {
      addNotification(`${newLevel.icon} ¡Subiste al Nivel ${newLevel.level}!`, 'levelup', newLevel.title);
      return newLevel;
    }
    return null;
  };

  // Sistema de Logros
  const unlockAchievement = (achievementId) => {
    setGameData(prevData => {
      const achievements = prevData.achievements || [];
      if (!achievements.includes(achievementId)) {
        return {
          ...prevData,
          achievements: [...achievements, achievementId]
        };
      }
      return prevData;
    });
  };

  const hasAchievement = (achievementId) => {
    return gameData.achievements?.includes(achievementId) || false;
  };

  // Sistema de Colecciones
  const updateCollection = (collectionId) => {
    setGameData(prevData => {
      const collections = prevData.collections || [];
      if (!collections.includes(collectionId)) {
        return {
          ...prevData,
          collections: [...collections, collectionId]
        };
      }
      return prevData;
    });
  };

  // Sistema de Boss Battles
  const defeatBoss = (bossId) => {
    setGameData(prevData => {
      const defeatedBosses = prevData.defeatedBosses || [];
      if (!defeatedBosses.includes(bossId)) {
        return {
          ...prevData,
          defeatedBosses: [...defeatedBosses, bossId]
        };
      }
      return prevData;
    });
  };

  const hasDefeatedBoss = (bossId) => {
    return gameData.defeatedBosses?.includes(bossId) || false;
  };

  // Verificar características desbloqueadas
  const hasFeature = (feature) => {
    return gameData.user?.unlockedFeatures?.includes(feature) || false;
  };

  // Sistema de Personalización - Temas
  const setTheme = (theme) => {
    setGameData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        theme
      }
    }));
  };

  const setAccentColor = (accentColor) => {
    setGameData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        accentColor
      }
    }));
  };

  // Sistema de Personalización - Avatares
  const updateAvatar = (avatarUpdates) => {
    setGameData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        avatar: {
          ...prevData.user.avatar,
          ...avatarUpdates
        }
      }
    }));
  };

  // Generar URL de avatar basado en configuración
  const getAvatarUrl = (size = 200) => {
    const { avatar } = gameData.user;
    const seed = avatar?.seed || 'default';
    const style = avatar?.style || 'adventurer';
    const bg = avatar?.backgroundColor || 'b6e3f4';

    // Usar DiceBear API para generar avatares
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bg}&size=${size}`;
  };

  // Estilos de avatar disponibles
  const avatarStyles = [
    { id: 'adventurer', name: 'Aventurero', icon: '🗡️' },
    { id: 'avataaars', name: 'Humanoide', icon: '👤' },
    { id: 'bottts', name: 'Robot', icon: '🤖' },
    { id: 'fun-emoji', name: 'Emoji', icon: '😊' },
    { id: 'lorelei', name: 'Lorelei', icon: '👩' },
    { id: 'notionists', name: 'Notion', icon: '💡' },
    { id: 'open-peeps', name: 'Peeps', icon: '🧍' },
    { id: 'pixel-art', name: 'Pixel Art', icon: '👾' }
  ];

  // Colores de acento disponibles
  const accentColors = [
    { id: 'purple', name: 'Púrpura', class: 'purple', hex: '#9333ea' },
    { id: 'blue', name: 'Azul', class: 'blue', hex: '#3b82f6' },
    { id: 'green', name: 'Verde', class: 'green', hex: '#22c55e' },
    { id: 'orange', name: 'Naranja', class: 'orange', hex: '#f97316' },
    { id: 'pink', name: 'Rosa', class: 'pink', hex: '#ec4899' },
    { id: 'red', name: 'Rojo', class: 'red', hex: '#ef4444' }
  ];

  // Configuración de temas
  const themes = {
    light: {
      name: 'Claro',
      icon: '☀️',
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-gray-200'
    },
    dark: {
      name: 'Oscuro',
      icon: '🌙',
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-gray-700'
    }
  };

  const value = {
    gameData,
    updateGameData,
    setGameData,
    addNotification,
    notifications,
    dismissNotification,
    markNotificationsRead,
    clearNotificationHistory,
    updateLifeAreaProgress,
    updateObjectiveProgress,
    completeLifeAreaObjective,
    addCalendarEvent,
    removeCalendarEvent,
    updateUserRank,
    checkLevelUp,
    unlockAchievement,
    hasAchievement,
    updateCollection,
    defeatBoss,
    hasDefeatedBoss,
    hasFeature,
    rankSystem,
    // HP y RPG
    healHp,
    usePotion,
    buyItem,
    SHOP_ITEMS,
    // Malos hábitos
    addBadHabit,
    relapseBadHabit,
    deleteBadHabit,
    updateBadHabitDays,
    // Personalización
    setTheme,
    setAccentColor,
    updateAvatar,
    getAvatarUrl,
    avatarStyles,
    accentColors,
    themes
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataContext;
