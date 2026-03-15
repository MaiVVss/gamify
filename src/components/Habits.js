import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CheckSquare, Plus, Search, Calendar, AlertCircle, CheckCircle, Clock, Zap, Edit2, Trash2, X, Sun, Moon, Heart, Target, Flame, TrendingUp, Award, Filter } from 'lucide-react';

// Objetivos predefinidos por área (mismo sistema que LifeAreas)
const areaObjectives = {
  health: [
    { id: 1, title: 'Perder peso', description: 'Bajar 5 kg en 3 meses', xp: 50, coins: 25, completed: false, progress: 0 },
    { id: 2, title: 'Correr 10km', description: 'Ser capaz de correr 10km sin parar', xp: 30, coins: 15, completed: false, progress: 0 },
    { id: 3, title: 'Glass skin', description: 'Rutina de cuidado facial diario', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 4, title: 'Dormir 8 horas', description: 'Mantener sueño de 8 horas nightly', xp: 35, coins: 18, completed: false, progress: 0 },
    { id: 5, title: 'Dieta balanceada', description: 'Comer vegetales en cada comida', xp: 45, coins: 22, completed: false, progress: 0 }
  ],
  career: [
    { id: 1, title: 'Certificación nueva', description: 'Obtener certificación profesional', xp: 60, coins: 30, completed: false, progress: 0 },
    { id: 2, title: 'Proyecto liderado', description: 'Liderar proyecto importante', xp: 50, coins: 25, completed: false, progress: 0 },
    { id: 3, title: 'Red de contactos', description: 'Expandir red profesional', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 4, title: 'Habilidad nueva', description: 'Aprender nueva habilidad relevante', xp: 45, coins: 22, completed: false, progress: 0 },
    { id: 5, title: 'Promoción', description: 'Obtener promoción o aumento', xp: 70, coins: 35, completed: false, progress: 0 }
  ],
  relationships: [
    { id: 1, title: 'Llamadas familiares', description: 'Llamar a familiares semanalmente', xp: 30, coins: 15, completed: false, progress: 0 },
    { id: 2, title: 'Amigos nuevos', description: 'Hacer 3 nuevos amigos', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 3, title: 'Voluntariado', description: 'Participar en actividad comunitaria', xp: 35, coins: 18, completed: false, progress: 0 },
    { id: 4, title: 'Evento social', description: 'Asistir a evento social mensual', xp: 25, coins: 12, completed: false, progress: 0 },
    { id: 5, title: 'Mentoría', description: 'Mentorar a alguien', xp: 45, coins: 22, completed: false, progress: 0 }
  ],
  personal: [
    { id: 1, title: 'Leer libros', description: 'Leer 12 libros este año', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 2, title: 'Aprender idioma', description: 'Aprender basics de nuevo idioma', xp: 50, coins: 25, completed: false, progress: 0 },
    { id: 3, title: 'Diario personal', description: 'Escribir en diario diario', xp: 30, coins: 15, completed: false, progress: 0 },
    { id: 4, title: 'Proyecto creativo', description: 'Completar proyecto personal', xp: 45, coins: 22, completed: false, progress: 0 },
    { id: 5, title: 'Meditación mindfulness', description: 'Practicar mindfulness regularmente', xp: 35, coins: 18, completed: false, progress: 0 }
  ],
  finances: [
    { id: 1, title: 'Fondo emergencia', description: 'Crear fondo de emergencia', xp: 50, coins: 25, completed: false, progress: 0 },
    { id: 2, title: 'Presupuesto mensual', description: 'Seguir presupuesto estrictamente', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 3, title: 'Inversión inicial', description: 'Hacer primera inversión', xp: 45, coins: 22, completed: false, progress: 0 },
    { id: 4, title: 'Deuda cero', description: 'Pagar todas las deudas', xp: 60, coins: 30, completed: false, progress: 0 },
    { id: 5, title: 'Ingreso pasivo', description: 'Crear fuente ingreso pasivo', xp: 70, coins: 35, completed: false, progress: 0 }
  ],
  home: [
    { id: 1, title: 'Organización', description: 'Organizar toda la casa', xp: 35, coins: 18, completed: false, progress: 0 },
    { id: 2, title: 'Espacio minimalista', description: 'Reducir pertenencias 50%', xp: 40, coins: 20, completed: false, progress: 0 },
    { id: 3, title: 'Rutina limpieza', description: 'Establecer rutina semanal', xp: 30, coins: 15, completed: false, progress: 0 },
    { id: 4, title: 'Decoración personal', description: 'Decorar según personalidad', xp: 25, coins: 12, completed: false, progress: 0 },
    { id: 5, title: 'Sostenibilidad', description: 'Implementar prácticas eco', xp: 45, coins: 22, completed: false, progress: 0 }
  ]
};

const lifeAreas = [
  { id: 'health', name: 'Salud', color: 'from-green-400 to-emerald-600', icon: '❤️' },
  { id: 'career', name: 'Carrera', color: 'from-blue-400 to-indigo-600', icon: '💼' },
  { id: 'relationships', name: 'Relaciones', color: 'from-pink-400 to-rose-600', icon: '👥' },
  { id: 'personal', name: 'Personal', color: 'from-purple-400 to-violet-600', icon: '🧠' },
  { id: 'finances', name: 'Finanzas', color: 'from-yellow-400 to-amber-600', icon: '💰' },
  { id: 'home', name: 'Hogar', color: 'from-orange-400 to-red-600', icon: '🏠' }
];

const difficulties = [
  { id: 'easy', name: 'Fácil', xp: 10, coins: 5, color: 'from-green-400 to-emerald-500' },
  { id: 'medium', name: 'Medio', xp: 20, coins: 10, color: 'from-yellow-400 to-amber-500' },
  { id: 'hard', name: 'Difícil', xp: 35, coins: 20, color: 'from-orange-400 to-red-500' },
  { id: 'extreme', name: 'Extremo', xp: 50, coins: 30, color: 'from-red-400 to-rose-600' }
];

const exampleHabits = [
  {
    id: 1,
    name: 'Ejercicio Matutino',
    description: '30 minutos de cardio',
    icon: '🏃',
    category: 'health',
    difficulty: 'medium',
    timeOfDay: 'morning',
    frequency: 'Diario',
    target: '30 min',
    xp: 15,
    coins: 8,
    streak: 15,
    completedToday: false,
    totalCompletions: 45,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    connectedObjectives: [1] // Conectado a "Perder peso"
  },
  {
    id: 2,
    name: 'Leer libro',
    description: 'Leer 20 páginas',
    icon: '📚',
    category: 'personal',
    difficulty: 'easy',
    timeOfDay: 'evening',
    frequency: 'Diario',
    target: '20 páginas',
    xp: 10,
    coins: 5,
    streak: 30,
    completedToday: false,
    totalCompletions: 90,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    connectedObjectives: [1] // Conectado a "Leer 12 libros"
  },
  {
    id: 3,
    name: 'Meditar',
    description: 'Meditación guiada de 10 minutos',
    icon: '🧘',
    category: 'personal',
    difficulty: 'easy',
    timeOfDay: 'morning',
    frequency: 'Diario',
    target: '10 min',
    xp: 10,
    coins: 5,
    streak: 7,
    completedToday: false,
    totalCompletions: 21,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    connectedObjectives: [4] // Conectado a "Meditación"
  },
  {
    id: 4,
    name: 'Beber Agua',
    description: '2 litros de agua durante el día',
    icon: '💧',
    category: 'health',
    difficulty: 'easy',
    timeOfDay: 'anytime',
    frequency: 'Diario',
    target: '2L',
    xp: 10,
    coins: 5,
    streak: 5,
    completedToday: false,
    totalCompletions: 15,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    connectedObjectives: [4] // Conectado a "Beber 2L agua"
  },
  {
    id: 5,
    name: 'Llamar a mamá',
    description: 'Llamar a mamá 2 veces por semana',
    icon: '📞',
    category: 'relationships',
    difficulty: 'easy',
    timeOfDay: 'afternoon',
    frequency: 'Semanal',
    target: '1 llamada',
    xp: 10,
    coins: 5,
    streak: 2,
    completedToday: false,
    totalCompletions: 8,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    name: 'Agua Suficiente',
    description: 'Beber al menos 2 litros de agua',
    icon: '💧',
    category: 'health',
    difficulty: 'easy',
    timeOfDay: 'all',
    frequency: 'Diario',
    target: '2 litros',
    xp: 10,
    coins: 5,
    streak: 21,
    completedToday: false,
    totalCompletions: 63,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    name: 'Journaling',
    description: 'Escribir thoughts y reflexiones del día',
    icon: '✍️',
    category: 'personal',
    difficulty: 'easy',
    timeOfDay: 'night',
    frequency: 'Diario',
    target: '15 minutos',
    xp: 10,
    coins: 5,
    streak: 10,
    completedToday: false,
    totalCompletions: 35,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    name: 'Planificación del Día',
    description: 'Planificar las tareas y objetivos del día',
    icon: '📋',
    category: 'personal',
    difficulty: 'easy',
    timeOfDay: 'morning',
    frequency: 'Diario',
    target: '10 minutos',
    xp: 10,
    coins: 5,
    streak: 30,
    completedToday: false,
    totalCompletions: 90,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function Habits({ addNotification }) {
  const { gameData, updateGameData, updateLifeAreaProgress, updateObjectiveProgress, themes,
    addBadHabit, relapseBadHabit, deleteBadHabit, updateBadHabitDays, toggleHabit } = useData();
  const habits = gameData.habits || [];

  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  const [mainTab, setMainTab] = useState('good'); // 'good' | 'bad'
  const [filter, setFilter] = useState('all'); // Category filter
  const [mainFilter, setMainFilter] = useState('today'); // 'today' vs 'all' habits
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showBadHabitModal, setShowBadHabitModal] = useState(false);
  const [newBadHabitForm, setNewBadHabitForm] = useState({ name: '', icon: '👿', category: 'personal' });
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    icon: '⭐',
    category: 'personal',
    difficulty: 'easy',
    timeOfDay: 'morning',
    frequency: 'Diario',
    target: '',
    xp: 10,
    coins: 5,
    streak: 0,
    completedToday: false,
    totalCompletions: 0,
    createdAt: new Date().toISOString(),
    connectedObjective: null, // ID de objetivo conectado (individual)
    connectedObjectives: [], // Array de IDs de objetivos conectados (compatibilidad)
    customDays: [] // Días de la semana para frecuencia personalizada (0 = Domingo, 1 = Lunes...)
  });

  const weekDays = [
    { id: 1, label: 'L' },
    { id: 2, label: 'M' },
    { id: 3, label: 'X' },
    { id: 4, label: 'J' },
    { id: 5, label: 'V' },
    { id: 6, label: 'S' },
    { id: 0, label: 'D' }
  ];

  // No more automatic loading of exampleHabits - user starts with clean slate

  // Objetivos disponibles por área (IDs relativos al área, no globales)
  const areaObjectives = {
    health: [
      { id: 1, title: 'Perder peso', description: 'Bajar 5 kg en 3 meses' },
      { id: 2, title: 'Correr 10km', description: 'Ser capaz de correr 10km sin parar' },
      { id: 3, title: 'Dormir 8h', description: 'Dormir 8 horas diarias por un mes' },
      { id: 4, title: 'Beber 2L agua', description: 'Beber 2 litros de agua al día' },
      { id: 5, title: 'Glass skin', description: 'Rutina de cuidado facial diario' }
    ],
    career: [
      { id: 1, title: 'Promoción laboral', description: 'Obtener un ascenso en el trabajo' },
      { id: 2, title: 'Aprender inglés', description: 'Alcanzar nivel B2 de inglés' },
      { id: 3, title: 'Proyecto liderado', description: 'Liderar un proyecto exitoso' },
      { id: 4, title: 'Certificación', description: 'Obtener una certificación profesional' },
      { id: 5, title: 'Networking', description: 'Conectar con 10 profesionales del área' }
    ],
    relationships: [
      { id: 1, title: 'Llamar a mamá', description: 'Llamar a mamá 2 veces por semana' },
      { id: 2, title: 'Amigos nuevos', description: 'Hacer 3 nuevos amigos' },
      { id: 3, title: 'Pareja feliz', description: 'Tener 5 citas especiales al mes' },
      { id: 4, title: 'Familia unida', description: 'Organizar reunión familiar mensual' },
      { id: 5, title: 'Comunidad', description: 'Participar en actividad grupal semanal' }
    ],
    personal: [
      { id: 1, title: 'Leer 12 libros', description: 'Leer un libro al mes' },
      { id: 2, title: 'Escribir diario', description: 'Escribir en el diario todos los días' },
      { id: 3, title: 'Aprender guitarra', description: 'Tocar 5 canciones en guitarra' },
      { id: 4, title: 'Glass skin', description: 'Rutina de cuidado facial diario' },
      { id: 5, title: 'Creatividad', description: 'Crear algo nuevo cada semana' }
    ],
    finances: [
      { id: 1, title: 'Ahorro $1000', description: 'Ahorrar $1000 en 3 meses' },
      { id: 2, title: 'Ingresos extra', description: 'Ganar $500 extra al mes' },
      { id: 3, title: 'Invertir', description: 'Crear cartera de inversiones' },
      { id: 4, title: 'Presupuesto', description: 'Seguir presupuesto estricto por 2 meses' },
      { id: 5, title: 'Deuda cero', description: 'Pagar todas las deudas de tarjetas' }
    ],
    home: [
      { id: 1, title: 'Casa ordenada', description: 'Mantener casa ordenada por 1 mes' },
      { id: 2, title: 'Decorar habitación', description: 'Redecorar completamente la habitación' },
      { id: 3, title: 'Jardín', description: 'Crear y mantener jardín' },
      { id: 4, title: 'Reparaciones', description: 'Hacer todas las reparaciones pendientes' },
      { id: 5, title: 'Minimalismo', description: 'Donar 50 cosas que no necesitas' }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'border border-green-100 bg-green-50/30';
      case 'medium': return 'border border-yellow-100 bg-yellow-50/30';
      case 'hard': return 'border border-orange-100 bg-orange-50/30';
      case 'extreme': return 'border border-red-100 bg-red-50/30';
      default: return `border border-gray-100 bg-gray-50/30`;
    }
  };

  const calculateCompletionRate = (habit) => {
    if (!habit.createdAt) return 0;
    const daysSinceCreation = Math.max(1, Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)));
    
    // Calculate expected completions based on frequency
    let expectedCompletions = daysSinceCreation;
    if (habit.frequency === 'Diario') {
      expectedCompletions = daysSinceCreation;
    } else if (habit.frequency === 'Semanal') {
      expectedCompletions = Math.max(1, Math.ceil(daysSinceCreation / 7));
    } else if (habit.frequency === 'Personalizado' && habit.customDays) {
      // Count how many of the custom days have passed since creation
      expectedCompletions = 0;
      for (let i = 0; i < daysSinceCreation; i++) {
        const checkDate = new Date(habit.createdAt);
        checkDate.setDate(checkDate.getDate() + i);
        if (habit.customDays.includes(checkDate.getDay())) {
          expectedCompletions++;
        }
      }
      if (expectedCompletions === 0) expectedCompletions = 1; // Prevent division by zero
    }
    
    const completionRate = Math.round((habit.totalCompletions / expectedCompletions) * 100);
    return Math.min(completionRate, 100); // Cap at 100%
  };

  const filteredHabits = useMemo(() => {
    let filtered = habits;

    // 1. Filtrar por Main Filter (Hoy vs Todos)
    if (mainFilter === 'today') {
      const today = new Date().getDay(); // 0(Domingo) a 6(Sábado)
      filtered = filtered.filter(habit => {
        if (habit.frequency === 'Diario') return true;
        
        if (habit.frequency === 'Semanal' || habit.frequency === 'Personalizado') {
          // Si no tiene días configurados (array vacío o inexistente), no mostramos en Hoy.
          if (!habit.customDays || habit.customDays.length === 0) return false;
          return habit.customDays.includes(today);
        }
        
        return true; // Fallback para cualquier otra frecuencia futura
      });
    }
    
    // 2. Filtrar por Categoría
    if (filter !== 'all') {
      filtered = filtered.filter(habit => habit.category === filter);
    }
    
    return filtered.sort((a, b) => {
      if (a.completedToday !== b.completedToday) {
        return a.completedToday ? 1 : -1;
      }
      return b.streak - a.streak;
    });
  }, [habits, filter, mainFilter]);

  const handleToggleHabit = (habitId) => {
    toggleHabit(habitId);
  };

  const getRelatedObjectivesForHabit = (areaId, habitName) => {
    const objectivesMap = {
      health: {
        'perder': 1, 'peso': 1, 'correr': 2, 'dormir': 3, 'agua': 4, 'glass': 5, 'skin': 5, 'facial': 5, 'cuidado': 5,
        'ejercicio': 1, 'dieta': 1, 'gimnasio': 2, 'salud': 1, 'hidratarse': 4
      },
      career: {
        'promoción': 1, 'ascenso': 1, 'inglés': 2, 'aprender': 2, 'proyecto': 3,
        'liderar': 3, 'certificación': 4, 'certificado': 4, 'networking': 5,
        'conectar': 5, 'trabajo': 3, 'negocio': 3
      },
      relationships: {
        'mamá': 1, 'mama': 1, 'madre': 1, 'llamada': 1, 'amigos': 2, 'amistad': 2,
        'pareja': 3, 'cita': 3, 'familia': 4, 'reunión': 4, 'comunidad': 5
      },
      personal: {
        'libro': 1, 'leer': 1, 'diario': 2, 'escribir': 2, 'guitarra': 3,
        'tocar': 3, 'glass': 4, 'skin': 4, 'facial': 4, 'cuidado': 4, 'crear': 5, 'arte': 5, 'creatividad': 5
      },
      finances: {
        'ahorrar': 1, 'ahorro': 1, '1000': 1, 'ingresos': 2, 'extra': 2,
        'invertir': 3, 'inversión': 3, 'presupuesto': 4, 'deuda': 5, 'tarjeta': 5
      },
      home: {
        'casa': 1, 'ordenar': 1, 'limpiar': 1, 'decorar': 2, 'habitación': 2,
        'jardín': 3, 'reparar': 4, 'reparaciones': 4, 'donar': 5, 'minimalismo': 5
      }
    };

    const areaObjectives = objectivesMap[areaId] || {};
    const relatedIds = [];
    
    // Buscar palabras clave en el nombre del hábito
    const name = habitName.toLowerCase();
    Object.entries(areaObjectives).forEach(([keyword, objectiveId]) => {
      if (name.includes(keyword)) {
        relatedIds.push(objectiveId);
      }
    });
    
    return relatedIds;
  };

  const handleEditHabit = (habit) => {
    setEditingHabit({
      ...habit,
      connectedObjective: habit.connectedObjectives && habit.connectedObjectives.length > 0 ? habit.connectedObjectives[0] : null
    });
    setShowEditModal(true);
  };

  const handleUpdateHabit = () => {
    if (!editingHabit.name.trim()) {
      addNotification('El nombre del hábito es requerido', 'error');
      return;
    }

    const difficulty = difficulties.find(d => d.id === editingHabit.difficulty);
    const updatedHabit = {
      ...editingHabit,
      xp: difficulty.xp,
      coins: difficulty.coins,
      connectedObjectives: editingHabit.connectedObjective ? [editingHabit.connectedObjective] : []
    };

    const updatedHabits = habits.map(h => {
      if (h.id === editingHabit.id) {
        return updatedHabit;
      }
      // Si este hábito está conectado a objetivos que se actualizaron, actualizar también su lista de conexiones
      if (h.connectedObjectives && h.connectedObjectives.some(objId => 
        editingHabit.connectedObjectives.includes(objId))) {
        return {
          ...h,
          connectedObjectives: editingHabit.connectedObjectives
        };
      }
      return h;
    });
    
    updateGameData({ habits: updatedHabits });
    
    // Force UI update by triggering multiple events
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
      // Force React re-render by updating a dummy state
      updateGameData({ habits: [...updatedHabits] });
    }, 100);
    
    // CONEXIÓN CON OBJETIVOS: Avanzar progreso de objetivos conectados
    if (updatedHabit.connectedObjectives && updatedHabit.connectedObjectives.length > 0) {
      updatedHabit.connectedObjectives.forEach(objectiveId => {
        updateObjectiveProgress(updatedHabit.category, objectiveId, 5); // +5% por hábito
      });
    }
    
    addNotification(`Hábito "${updatedHabit.name}" actualizado`, 'success');
    setShowEditModal(false);
    setEditingHabit(null);
    setNewHabit({
      name: '',
      description: '',
      icon: '⭐',
      category: 'personal',
      difficulty: 'easy',
      frequency: 'Diario',
      target: '',
      xp: 10,
      coins: 5,
      streak: 0,
      completedToday: false,
      totalCompletions: 0,
      createdAt: new Date().toISOString(),
      connectedObjectives: [],
      customDays: []
    });
  };

  const handleDeleteHabit = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar el hábito "${habit.name}"?`)) {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      updateGameData({ habits: updatedHabits });
      addNotification(`Hábito "${habit.name}" eliminado`, 'success');
    }
  };

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) {
      addNotification('El nombre del hábito es requerido', 'error');
      return;
    }

    const difficulty = difficulties.find(d => d.id === newHabit.difficulty);
    const habit = {
      id: Date.now(),
      ...newHabit,
      xp: difficulty.xp,
      coins: difficulty.coins,
      streak: 0,
      completedToday: false,
      totalCompletions: 0,
      createdAt: new Date().toISOString(),
      connectedObjectives: newHabit.connectedObjective ? [newHabit.connectedObjective] : []
    };

    const updatedHabits = [...habits, habit];
    updateGameData({ habits: updatedHabits });

    setNewHabit({
      name: '',
      description: '',
      icon: '⭐',
      category: 'personal',
      difficulty: 'easy',
      timeOfDay: 'morning',
      frequency: 'Diario',
      target: '',
      xp: 10,
      coins: 5,
      connectedObjective: null,
      connectedObjectives: [],
      customDays: []
    });
    setShowModal(false);
    addNotification('Hábito creado exitosamente', 'success');
  };

  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.completedToday).length,
    longestStreak: Math.max(...habits.map(h => h.streak), 0),
    avgCompletion: habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + calculateCompletionRate(h), 0) / habits.length) : 0
  };

  const getTimeIcon = (timeOfDay) => {
    switch(timeOfDay) {
      case 'morning': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'night': return <Moon className="w-4 h-4 text-blue-600" />;
      case 'afternoon': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${themeConfig.text}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${themeConfig.text}`}>Hábitos</h1>
        </div>
        <button 
          onClick={() => mainTab === 'good' ? setShowModal(true) : setShowBadHabitModal(true)}
          className="btn-primary hidden md:flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {mainTab === 'good' ? 'Nuevo Hábito' : 'Nuevo Mal Hábito'}
        </button>
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 14, padding: 4, maxWidth: 400 }}>
        <button onClick={() => setMainTab('good')} style={{
          flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: mainTab === 'good' ? '#fff' : 'transparent',
          color: mainTab === 'good' ? '#4f46e5' : '#6b7280',
          fontWeight: mainTab === 'good' ? 700 : 500, fontSize: 13,
          boxShadow: mainTab === 'good' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s'
        }}>✨ Buenos Hábitos</button>
        <button onClick={() => { setMainTab('bad'); updateBadHabitDays(); }} style={{
          flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: mainTab === 'bad' ? '#fff' : 'transparent',
          color: mainTab === 'bad' ? '#ef4444' : '#6b7280',
          fontWeight: mainTab === 'bad' ? 700 : 500, fontSize: 13,
          boxShadow: mainTab === 'bad' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s'
        }}>⚔️ Malos Hábitos</button>
      </div>

      {/* BAD HABITS TAB */}
      {mainTab === 'bad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0a0a, #3b1515)',
            borderRadius: 18, padding: '20px 24px', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>⚔️ Batalla contra tus Demonios</h2>
              <p style={{ margin: '6px 0 0', color: '#fca5a5', fontSize: 13 }}>
                Cada día limpio reduce la vida del enemigo. ¡Una recaída y pierdes 10 HP!
              </p>
            </div>
            <button
              onClick={() => setShowBadHabitModal(true)}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: '#fff', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
              }}
            >
              <Plus style={{ width: 14, height: 14 }} /> Agregar Enemigo
            </button>
          </div>

          {(gameData.badHabits || []).length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚔️</div>
              <p style={{ margin: 0, fontWeight: 700, color: '#374151', fontSize: 16 }}>No tienes demonios registrados</p>
              <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: 13 }}>Agrega los malos hábitos que quieres vencer</p>
            </div>
          ) : (
            (gameData.badHabits || []).map(bh => {
              const bossHpPercent = Math.min(100, Math.max(0, 100 - bh.daysClean * 3)); // cada día limpio reduce 3% de vida al boss
              const bossColor = bossHpPercent > 60 ? '#ef4444' : bossHpPercent > 30 ? '#f59e0b' : '#22c55e';
              const milestoneNext = [7, 30, 100].find(m => !(bh.milestones || []).includes(m) && m > bh.daysClean);
              return (
                <div key={bh.id} style={{
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: 18, overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                }}>
                  {/* Boss Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1f2937, #374151)',
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: '#ef44441a', border: '2px solid #ef444444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
                    }}>{bh.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f9fafb', fontWeight: 800, fontSize: 15 }}>{bh.name}</div>
                      <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
                        Enemigo activo • {bh.daysClean} días limpio
                      </div>
                      {/* Boss HP bar */}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>☠️ Vida del Demonio</span>
                          <span style={{ fontSize: 10, color: bossColor, fontWeight: 700 }}>{Math.round(bossHpPercent)}%</span>
                        </div>
                        <div style={{ height: 8, background: '#374151', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${bossHpPercent}%`,
                            background: bossColor,
                            borderRadius: 999, transition: 'width 1s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div style={{ padding: '16px 20px' }}>
                    {/* Milestones */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                      {[7, 30, 100].map(m => {
                        const done = (bh.milestones || []).includes(m);
                        return (
                          <span key={m} style={{
                            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: done ? '#dcfce7' : '#f3f4f6',
                            color: done ? '#16a34a' : '#9ca3af',
                            border: done ? '1px solid #86efac' : '1px solid #e5e7eb'
                          }}>
                            {done ? '✅' : '🔒'} {m} días
                          </span>
                        );
                      })}
                      {milestoneNext && (
                        <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, color: '#6b7280', fontStyle: 'italic' }}>
                          Próximo: {milestoneNext - bh.daysClean} días más
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Registrar una recaída en "${bh.name}"? Perderás 10 HP.`)) {
                            relapseBadHabit(bh.id);
                          }
                        }}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid #fee2e2',
                          background: '#fff5f5', color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                        }}
                      >
                        💀 Recaída (-10 HP)
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar "${bh.name}" de tu lista?`)) {
                            deleteBadHabit(bh.id);
                          }
                        }}
                        style={{
                          padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
                          background: '#f9fafb', color: '#6b7280', cursor: 'pointer'
                        }}
                      >
                        <Trash2 style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Modal nuevo mal hábito */}
          {showBadHabitModal && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16
            }}>
              <div style={{
                background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
              }}>
                <h2 style={{ margin: '0 0 20px', fontWeight: 800, color: '#1f2937' }}>⚔️ Nuevo Enemigo</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Nombre del mal hábito *</label>
                    <input type="text" value={newBadHabitForm.name}
                      onChange={e => setNewBadHabitForm({ ...newBadHabitForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      placeholder="Ej: Redes sociales, Fumar, Azúcar..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Icono</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['👿','😈','💀','🦥','🔥','🍳','📱','🍺','🎯','🍬'].map(ic => (
                        <button key={ic} onClick={() => setNewBadHabitForm({ ...newBadHabitForm, icon: ic })}
                          style={{
                            width: 40, height: 40, borderRadius: 8, border: newBadHabitForm.icon === ic ? '2px solid #ef4444' : '1px solid #e5e7eb',
                            background: newBadHabitForm.icon === ic ? '#fff5f5' : '#f9fafb',
                            cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >{ic}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button onClick={() => setShowBadHabitModal(false)}
                    style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: 600, color: '#6b7280' }}>
                    Cancelar
                  </button>
                  <button onClick={() => {
                    if (!newBadHabitForm.name.trim()) return;
                    addBadHabit(newBadHabitForm);
                    setNewBadHabitForm({ name: '', icon: '👿', category: 'personal' });
                    setShowBadHabitModal(false);
                    addNotification('⚔️ ¡Enemigo registrado! Empieza a vencerlo día a día.', 'info');
                  }}
                    style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    ⚔️ Agregar Enemigo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GOOD HABITS TAB - everything below only shows when mainTab === 'good' */}
      {mainTab === 'good' && (<>

      {/* Filtros Principales (Hoy vs Todos) y Filtros por Categoría */}
      <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border} space-y-4`}>
        {/* Main Filters */}
        <div className="flex bg-gray-100/50 p-1 rounded-lg w-full md:w-fit">
          <button
            onClick={() => setMainFilter('today')}
            className={`flex-1 md:w-32 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mainFilter === 'today'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setMainFilter('all')}
            className={`flex-1 md:w-32 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mainFilter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <Filter className={`w-5 h-5 ${themeConfig.textMuted}`} />
          <span className={`font-medium ${themeConfig.text}`}>Categoría:</span>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar pb-1 gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : `${themeConfig.textMuted} hover:${themeConfig.text} hover:${themeConfig.bg}`
            }`}
          >
            Todas
          </button>
          {lifeAreas.map(area => (
            <button
              key={area.id}
              onClick={() => setFilter(area.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filter === area.id 
                  ? 'bg-blue-600 text-white' 
                  : `${themeConfig.textMuted} hover:${themeConfig.text} hover:${themeConfig.bg}`
              }`}
            >
              <span>{area.icon}</span>
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista principal: siempre arriba al entrar */}
      <div className="mb-6">
        <ul className="space-y-3">
          {filteredHabits.map(habit => {
            const category = lifeAreas.find(area => area.id === habit.category) || { icon: '❔', name: 'Sin categoría' };
            const completionRate = calculateCompletionRate(habit);
            return (
            <li key={habit.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-start gap-3 min-w-0">
                <button onClick={() => handleToggleHabit(habit.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center mt-1 ${habit.completedToday ? 'bg-green-500 text-white' : 'bg-white border border-gray-200'}`}>
                  {habit.completedToday ? <CheckCircle className="w-4 h-4 text-white" /> : <CheckSquare className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl mr-1 flex-shrink-0">{habit.icon}</span>
                    <div className={`font-medium truncate ${habit.completedToday ? 'line-through opacity-60' : ''}`}>{habit.name}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 truncate">
                    <span className="flex items-center gap-1">
                      <span className="text-sm">{category.icon}</span>
                      <span className="whitespace-nowrap">{category.name}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {getTimeIcon(habit.timeOfDay)}
                      <span className="capitalize">{habit.timeOfDay}</span>
                    </span>
                    <span>•</span>
                    <span className="font-medium">{completionRate}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <div className="text-xs text-blue-600 font-semibold">+{habit.xp}</div>
                  <div className="text-xs text-yellow-600 font-semibold">🪙{habit.coins}</div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right text-[11px] text-gray-600">
                  <span>🔥 {habit.streak}d</span>
                  <span>✔ {habit.totalCompletions}</span>
                </div>
                <button onClick={() => handleEditHabit(habit)} className="p-1 text-gray-400 hover:text-blue-600 hidden md:inline-flex"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => handleDeleteHabit(habit.id)} className="p-1 text-gray-400 hover:text-red-600 hidden md:inline-flex"><Trash2 className="w-4 h-4"/></button>
              </div>
            </li>
          )})}
        </ul>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{stats.totalHabits}</div>
              <div className={`text-sm ${themeConfig.textMuted}`}>Total Hábitos</div>
            </div>
          </div>
        </div>
        
        <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{stats.completedToday}/{stats.totalHabits}</div>
              <div className={`text-sm ${themeConfig.textMuted}`}>Completados Hoy</div>
            </div>
          </div>
        </div>
        
        <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{stats.longestStreak}</div>
              <div className={`text-sm ${themeConfig.textMuted}`}>Racha Más Larga</div>
            </div>
          </div>
        </div>
        
        <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{stats.avgCompletion}%</div>
              <div className={`text-sm ${themeConfig.textMuted}`}>Tasa de Éxito</div>
            </div>
          </div>
        </div>
        
        <div className={`${themeConfig.card} p-4 rounded-xl border ${themeConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{habits.filter(h => h.streak >= 7).length}</div>
              <div className={`text-sm ${themeConfig.textMuted}`}>Rachas de 7+ días</div>
            </div>
          </div>
        </div>
      </div>



      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setShowModal(true)}
        className="md:hidden floating-button bottom-24"
        title="Crear Nuevo Hábito"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal para Editar Hábito */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Editar Hábito</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nombre del Hábito *
                </label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: Meditación Matutina"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingHabit.description}
                  onChange={(e) => setEditingHabit({...editingHabit, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu hábito..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Icono
                </label>
                <input
                  type="text"
                  value={editingHabit.icon}
                  onChange={(e) => setEditingHabit({...editingHabit, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="⭐"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Categoría
                </label>
                <select
                  value={editingHabit.category}
                  onChange={(e) => setEditingHabit({...editingHabit, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  {lifeAreas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.icon} {area.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Dificultad
                </label>
                <select
                  value={editingHabit.difficulty}
                  onChange={(e) => setEditingHabit({...editingHabit, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>
                      {diff.name} (+{diff.xp} XP, +{diff.coins} coins)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Momento del Día
                </label>
                <select
                  value={editingHabit.timeOfDay}
                  onChange={(e) => setEditingHabit({...editingHabit, timeOfDay: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="morning">Mañana</option>
                  <option value="afternoon">Tarde</option>
                  <option value="night">Noche</option>
                  <option value="all">Todo el día</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Frecuencia
                </label>
                <select
                  value={editingHabit.frequency}
                  onChange={(e) => setEditingHabit({...editingHabit, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>

              {(editingHabit.frequency === 'Personalizado' || editingHabit.frequency === 'Semanal') && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Días de la Semana
                  </label>
                  <div className="flex gap-2 justify-between">
                    {weekDays.map(day => {
                      const isSelected = editingHabit.customDays?.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => {
                            const currentDays = editingHabit.customDays || [];
                            const newDays = isSelected 
                              ? currentDays.filter(d => d !== day.id)
                              : [...currentDays, day.id];
                            setEditingHabit({...editingHabit, customDays: newDays});
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Meta / Objetivo
                </label>
                <input
                  type="text"
                  value={editingHabit.target}
                  onChange={(e) => setEditingHabit({...editingHabit, target: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: 30 minutos, 10 páginas, 1 hora"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Conectar con Objetivo de Vida
                </label>
                <select
                  value={editingHabit.connectedObjective || ''}
                  onChange={(e) => setEditingHabit({...editingHabit, connectedObjective: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Sin conexión</option>
                  {editingHabit.category && areaObjectives[editingHabit.category]?.map(objective => (
                    <option key={objective.id} value={objective.id}>
                      {lifeAreas.find(area => area.id === editingHabit.category)?.icon} {objective.title} (+{objective.xp} XP)
                    </option>
                  ))}
                </select>
                {editingHabit.category && !areaObjectives[editingHabit.category] && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona una categoría primero</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateHabit}
                className="flex-1 btn-primary"
              >
                Actualizar Hábito
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-glow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuevo Hábito</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nombre del Hábito *
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: Meditación Matutina"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu hábito..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Icono
                </label>
                <input
                  type="text"
                  value={newHabit.icon}
                  onChange={(e) => setNewHabit({...newHabit, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="⭐"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Categoría
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  {lifeAreas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.icon} {area.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Dificultad
                </label>
                <select
                  value={newHabit.difficulty}
                  onChange={(e) => setNewHabit({...newHabit, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>
                      {diff.name} (+{diff.xp} XP, +{diff.coins} coins)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Momento del Día
                </label>
                <select
                  value={newHabit.timeOfDay}
                  onChange={(e) => setNewHabit({...newHabit, timeOfDay: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="morning">Mañana</option>
                  <option value="afternoon">Tarde</option>
                  <option value="night">Noche</option>
                  <option value="all">Todo el día</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Frecuencia
                </label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>

              {(newHabit.frequency === 'Personalizado' || newHabit.frequency === 'Semanal') && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Días de la Semana
                  </label>
                  <div className="flex gap-2 justify-between">
                    {weekDays.map(day => {
                      const isSelected = newHabit.customDays?.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => {
                            const currentDays = newHabit.customDays || [];
                            const newDays = isSelected 
                              ? currentDays.filter(d => d !== day.id)
                              : [...currentDays, day.id];
                            setNewHabit({...newHabit, customDays: newDays});
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Meta / Objetivo
                </label>
                <input
                  type="text"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({...newHabit, target: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: 30 minutos, 10 páginas, 1 hora"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Conectar con Objetivo de Vida
                </label>
                <select
                  value={newHabit.connectedObjective || ''}
                  onChange={(e) => setNewHabit({...newHabit, connectedObjective: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Sin conexión</option>
                  {newHabit.category && areaObjectives[newHabit.category]?.map(objective => (
                    <option key={objective.id} value={objective.id}>
                      {lifeAreas.find(area => area.id === newHabit.category)?.icon} {objective.title} (+{objective.xp} XP)
                    </option>
                  ))}
                </select>
                {newHabit.category && !areaObjectives[newHabit.category] && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona una categoría primero</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddHabit}
                className="flex-1 btn-primary"
              >
                Crear Hábito
              </button>
            </div>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}

export default Habits;
