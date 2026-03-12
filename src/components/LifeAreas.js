import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Target, TrendingUp, Award, Plus, ChevronUp, ChevronDown, Star, Trophy, Zap, Edit2, Trash2, CheckCircle } from 'lucide-react';

const lifeAreaDetails = {
  health: {
    name: 'Salud & Bienestar',
    description: 'Cuidado físico, mental y emocional',
    color: 'from-green-400 to-emerald-600',
    icon: '❤️',
    milestones: [
      { level: 1, name: 'Principiante', xp: 0, reward: 'Meditación de 5 min' },
      { level: 2, name: 'Entusiasta', xp: 100, reward: 'Rutina semanal' },
      { level: 3, name: 'Atleta', xp: 300, reward: 'Meta fitness' },
      { level: 4, name: 'Maestro', xp: 600, reward: 'Estilo de vida saludable' },
      { level: 5, name: 'Leyenda', xp: 1000, reward: 'Transformación completa' }
    ]
  },
  career: {
    name: 'Carrera & Profesión',
    description: 'Desarrollo profesional y crecimiento laboral',
    color: 'from-blue-400 to-indigo-600',
    icon: '💼',
    milestones: [
      { level: 1, name: 'Aprendiz', xp: 0, reward: 'CV actualizado' },
      { level: 2, name: 'Profesional', xp: 100, reward: 'Curso completado' },
      { level: 3, name: 'Experto', xp: 300, reward: 'Proyecto liderado' },
      { level: 4, name: 'Mentor', xp: 600, reward: 'Equipo gestionado' },
      { level: 5, name: 'Visionario', xp: 1000, reward: 'Innovación creada' }
    ]
  },
  relationships: {
    name: 'Relaciones Sociales',
    description: 'Conexiones personales y red de apoyo',
    color: 'from-pink-400 to-rose-600',
    icon: '👥',
    milestones: [
      { level: 1, name: 'Introvertido', xp: 0, reward: 'Conversación profunda' },
      { level: 2, name: 'Conector', xp: 100, reward: 'Evento social asistido' },
      { level: 3, name: 'Comunicador', xp: 300, reward: 'Red de apoyo activa' },
      { level: 4, name: 'Líder', xp: 600, reward: 'Comunidad creada' },
      { level: 5, name: 'Influencer', xp: 1000, reward: 'Impacto positivo masivo' }
    ]
  },
  personal: {
    name: 'Desarrollo Personal',
    description: 'Crecimiento individual y autoconocimiento',
    color: 'from-purple-400 to-violet-600',
    icon: '🧠',
    milestones: [
      { level: 1, name: 'Explorador', xp: 0, reward: 'Libro leído' },
      { level: 2, name: 'Estudiante', xp: 100, reward: 'Habilidad nueva' },
      { level: 3, name: 'Practicante', xp: 300, reward: 'Proyecto personal' },
      { level: 4, name: 'Sabio', xp: 600, reward: 'Sabiduría compartida' },
      { level: 5, name: 'Iluminado', xp: 1000, reward: 'Maestría alcanzada' }
    ]
  },
  finances: {
    name: 'Finanzas',
    description: 'Salud financiera y prosperidad',
    color: 'from-yellow-400 to-amber-600',
    icon: '💰',
    milestones: [
      { level: 1, name: 'Ahorrador', xp: 0, reward: 'Presupuesto creado' },
      { level: 2, name: 'Inversor', xp: 100, reward: 'Fondo de emergencia' },
      { level: 3, name: 'Generador', xp: 300, reward: 'Ingreso pasivo' },
      { level: 4, name: 'Administrador', xp: 600, reward: 'Portafolio diversificado' },
      { level: 5, name: 'Magnate', xp: 1000, reward: 'Libertad financiera' }
    ]
  },
  home: {
    name: 'Hogar & Entorno',
    description: 'Espacio vital y organización',
    color: 'from-orange-400 to-red-600',
    icon: '🏠',
    milestones: [
      { level: 1, name: 'Ocupante', xp: 0, reward: 'Espacio limpio' },
      { level: 2, name: 'Organizador', xp: 100, reward: 'Sistema implementado' },
      { level: 3, name: 'Decorador', xp: 300, reward: 'Ambiente optimizado' },
      { level: 4, name: 'Anfitrión', xp: 600, reward: 'Hogar funcional' },
      { level: 5, name: 'Arquitecto', xp: 1000, reward: 'Espacio transformador' }
    ]
  }
};

function LifeAreas({ addNotification }) {
  const { gameData, updateGameData, updateLifeAreaProgress, updateObjectiveProgress } = useData();
  const [selectedArea, setSelectedArea] = useState(null);
  const [showMilestones, setShowMilestones] = useState(null);
  const [showObjectives, setShowObjectives] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    xp: 25,
    coins: 12,
    areaId: ''
  });

  // Objetivos predefinidos por área
  const areaObjectives = {
    health: [
      { id: 1, title: 'Perder peso', description: 'Bajar 5 kg en 3 meses', xp: 50, coins: 25, completed: false, progress: 0 },
      { id: 2, title: 'Correr 10km', description: 'Ser capaz de correr 10km sin parar', xp: 30, coins: 15, completed: false, progress: 0 },
      { id: 3, title: 'Dormir 8h', description: 'Dormir 8 horas diarias por un mes', xp: 25, coins: 12, completed: false, progress: 0 },
      { id: 4, title: 'Beber 2L agua', description: 'Beber 2 litros de agua al día', xp: 20, coins: 10, completed: false, progress: 0 },
      { id: 5, title: 'Meditar diario', description: 'Meditar 15 minutos todos los días', xp: 30, coins: 15, completed: false, progress: 0 }
    ],
    career: [
      { id: 1, title: 'Promoción laboral', description: 'Obtener un ascenso en el trabajo', xp: 100, coins: 50, completed: false, progress: 0 },
      { id: 2, title: 'Aprender inglés', description: 'Alcanzar nivel B2 de inglés', xp: 40, coins: 20, completed: false, progress: 0 },
      { id: 3, title: 'Proyecto liderado', description: 'Liderar un proyecto exitoso', xp: 60, coins: 30, completed: false, progress: 0 },
      { id: 4, title: 'Certificación', description: 'Obtener una certificación profesional', xp: 35, coins: 18, completed: false, progress: 0 },
      { id: 5, title: 'Networking', description: 'Conectar con 10 profesionales del área', xp: 25, coins: 12, completed: false, progress: 0 }
    ],
    relationships: [
      { id: 1, title: 'Llamar a mamá', description: 'Llamar a mamá 2 veces por semana', xp: 20, coins: 10, completed: false, progress: 0 },
      { id: 2, title: 'Amigos nuevos', description: 'Hacer 3 nuevos amigos', xp: 30, coins: 15, completed: false, progress: 0 },
      { id: 3, title: 'Pareja feliz', description: 'Tener 5 citas especiales al mes', xp: 25, coins: 12, completed: false, progress: 0 },
      { id: 4, title: 'Familia unida', description: 'Organizar reunión familiar mensual', xp: 20, coins: 10, completed: false, progress: 0 },
      { id: 5, title: 'Comunidad', description: 'Participar en actividad grupal semanal', xp: 15, coins: 8, completed: false, progress: 0 }
    ],
    personal: [
      { id: 1, title: 'Leer 12 libros', description: 'Leer un libro al mes', xp: 40, coins: 20, completed: false, progress: 0 },
      { id: 2, title: 'Escribir diario', description: 'Escribir en el diario todos los días', xp: 25, coins: 12, completed: false, progress: 0 },
      { id: 3, title: 'Aprender guitarra', description: 'Tocar 5 canciones en guitarra', xp: 35, coins: 18, completed: false, progress: 0 },
      { id: 4, title: 'Meditación', description: 'Meditar 10 minutos diarios', xp: 20, coins: 10, completed: false, progress: 0 },
      { id: 5, title: 'Creatividad', description: 'Crear algo nuevo cada semana', xp: 30, coins: 15, completed: false, progress: 0 }
    ],
    finances: [
      { id: 1, title: 'Ahorro $1000', description: 'Ahorrar $1000 en 3 meses', xp: 50, coins: 25, completed: false, progress: 0 },
      { id: 2, title: 'Ingresos extra', description: 'Ganar $500 extra al mes', xp: 40, coins: 20, completed: false, progress: 0 },
      { id: 3, title: 'Invertir', description: 'Crear cartera de inversiones', xp: 35, coins: 18, completed: false, progress: 0 },
      { id: 4, title: 'Presupuesto', description: 'Seguir presupuesto estricto por 2 meses', xp: 25, coins: 12, completed: false, progress: 0 },
      { id: 5, title: 'Deuda cero', description: 'Pagar todas las deudas de tarjetas', xp: 60, coins: 30, completed: false, progress: 0 }
    ],
    home: [
      { id: 1, title: 'Casa ordenada', description: 'Mantener casa ordenada por 1 mes', xp: 30, coins: 15, completed: false, progress: 0 },
      { id: 2, title: 'Decorar habitación', description: 'Redecorar completamente la habitación', xp: 25, coins: 12, completed: false, progress: 0 },
      { id: 3, title: 'Jardín', description: 'Crear y mantener jardín', xp: 35, coins: 18, completed: false, progress: 0 },
      { id: 4, title: 'Reparaciones', description: 'Hacer todas las reparaciones pendientes', xp: 20, coins: 10, completed: false, progress: 0 },
      { id: 5, title: 'Minimalismo', description: 'Donar 50 cosas que no necesitas', xp: 15, coins: 8, completed: false, progress: 0 }
    ]
  };

  const handleProgressChange = (areaId, change) => {
    updateLifeAreaProgress(areaId, change);
  };

  const getObjectivesForArea = (areaId) => {
    const area = gameData.lifeAreas.find(a => a.id === areaId);
    let savedObjectives = area?.objectives || [];
    const completedObjectives = area?.completedObjectives || [];
    const objectiveProgress = area?.objectiveProgress || {};
    
    // Si no hay objetivos guardados, usar los predefinidos
    if (savedObjectives.length === 0) {
      const predefinedObjectives = areaObjectives[areaId] || [];
      return predefinedObjectives.map(objective => ({
        ...objective,
        completed: completedObjectives.includes(objective.id),
        progress: objectiveProgress[objective.id] || 0
      }));
    }
    
    // Usar los objetivos guardados
    return savedObjectives.map(objective => ({
      ...objective,
      completed: completedObjectives.includes(objective.id),
      progress: objectiveProgress[objective.id] || 0
    }));
  };

  const getCompletedObjectivesCount = (areaId) => {
    const area = gameData.lifeAreas.find(a => a.id === areaId);
    return area?.completedObjectives?.length || 0;
  };

  const getLevel = (progress) => {
    if (progress >= 80) return 5;
    if (progress >= 60) return 4;
    if (progress >= 40) return 3;
    if (progress >= 20) return 2;
    return 1;
  };

  const getLevelName = (progress) => {
    const details = lifeAreaDetails[selectedArea];
    if (!details) return '';
    const level = getLevel(progress);
    return details.milestones[level - 1].name;
  };

  const getNextMilestone = (progress) => {
    const details = lifeAreaDetails[selectedArea];
    if (!details) return null;
    const level = getLevel(progress);
    if (level < 5) {
      return details.milestones[level];
    }
    return null;
  };

  const getOverallStats = () => {
    const totalProgress = gameData.lifeAreas.reduce((acc, area) => acc + area.progress, 0);
    const averageProgress = totalProgress / gameData.lifeAreas.length;
    const maxLevel = Math.max(...gameData.lifeAreas.map(area => getLevel(area.progress)));
    const completedAreas = gameData.lifeAreas.filter(area => area.progress >= 80).length;
    
    return {
      averageProgress: Math.round(averageProgress),
      maxLevel,
      completedAreas,
      totalAreas: gameData.lifeAreas.length
    };
  };

  const handleEditObjective = (areaId, objective) => {
    setEditingObjective({ ...objective, areaId });
    setNewObjective({
      title: objective.title,
      description: objective.description,
      xp: objective.xp,
      coins: objective.coins,
      areaId: areaId
    });
    setShowEditModal(true);
  };

  const handleUpdateObjective = () => {
    if (!newObjective.title.trim()) {
      addNotification('El título del objetivo es requerido', 'error');
      return;
    }

    if (newObjective.xp < 1 || newObjective.coins < 1) {
      addNotification('XP y coins deben ser mayores a 0', 'error');
      return;
    }

    // Actualizar el objetivo en el estado global
    const updatedLifeAreas = gameData.lifeAreas.map(area => {
      if (area.id === editingObjective.areaId) {
        let currentObjectives = area.objectives || [];
        
        // Si no hay objetivos guardados, usar los predefinidos como base
        if (currentObjectives.length === 0) {
          const predefinedObjectives = areaObjectives[editingObjective.areaId] || [];
          currentObjectives = [...predefinedObjectives];
        }
        
        const objectiveIndex = currentObjectives.findIndex(obj => obj.id === editingObjective.id);
        
        if (objectiveIndex !== -1) {
          currentObjectives[objectiveIndex] = {
            ...currentObjectives[objectiveIndex],
            title: newObjective.title,
            description: newObjective.description,
            xp: newObjective.xp,
            coins: newObjective.coins
          };
        }
        
        return {
          ...area,
          objectives: currentObjectives
        };
      }
      return area;
    });

    updateGameData({ lifeAreas: updatedLifeAreas });
    
    // Force UI update by triggering a re-render
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
    
    addNotification(`Objetivo "${newObjective.title}" actualizado`, 'success');
    setShowEditModal(false);
    setEditingObjective(null);
    setNewObjective({
      title: '',
      description: '',
      xp: 25,
      coins: 12,
      areaId: ''
    });
  };

  const handleDeleteObjective = (areaId, objective) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el objetivo "${objective.title}"?`)) {
      // Eliminar el objetivo del estado global
      const updatedLifeAreas = gameData.lifeAreas.map(area => {
        if (area.id === areaId) {
          const updatedObjectives = area.objectives ? area.objectives.filter(obj => obj.id !== objective.id) : [];
          return {
            ...area,
            objectives: updatedObjectives
          };
        }
        return area;
      });

      updateGameData({ lifeAreas: updatedLifeAreas });
      addNotification(`Objetivo "${objective.title}" eliminado`, 'success');
    }
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Áreas de Vida</h1>
          <p className="text-gray-600">Desarrolla todas las facetas de tu vida</p>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-glow p-4 text-center">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.averageProgress}%</div>
          <div className="text-gray-600 text-sm">Progreso General</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.maxLevel}</div>
          <div className="text-gray-600 text-sm">Nivel Máximo</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.completedAreas}/{stats.totalAreas}</div>
          <div className="text-gray-600 text-sm">Áreas Dominadas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{gameData.user.level}</div>
          <div className="text-gray-600 text-sm">Tu Nivel Global</div>
        </div>
      </div>

      {/* Áreas de Vida Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameData.lifeAreas.map(area => {
          const details = lifeAreaDetails[area.id];
          const level = getLevel(area.progress);
          const nextMilestone = getNextMilestone(area.progress);
          
          return (
            <div key={area.id} className="card-glow p-6">
              {/* Header del Área */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${details.color} flex items-center justify-center text-2xl`}>
                    {details.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{details.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Nivel {level}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${details.color} text-white`}>
                        {details.milestones[level - 1].name}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArea(area.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 text-sm mb-4">{details.description}</p>

              {/* Barra de Progreso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">Progreso</span>
                  <span className="text-gray-800 text-sm font-medium">{area.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r ${details.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${area.progress}%` }}
                  />
                </div>
              </div>

              {/* Próximo Milestone */}
              {nextMilestone && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-800 text-sm font-medium">Próximo: {nextMilestone.name}</span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {nextMilestone.reward} • {nextMilestone.xp} XP
                  </div>
                </div>
              )}

              {/* Controles Rápidos */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleProgressChange(area.id, -5)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <ChevronDown className="w-4 h-4" />
                  -5%
                </button>
                <button
                  onClick={() => handleProgressChange(area.id, -1)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  -1%
                </button>
                <button
                  onClick={() => handleProgressChange(area.id, 1)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  +1%
                </button>
                <button
                  onClick={() => handleProgressChange(area.id, 5)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  +5%
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* Botón de Ver Milestones */}
              <button
                onClick={() => setShowMilestones(area.id)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Ver Milestones
              </button>

              {/* Botón de Ver Objetivos */}
              <button
                onClick={() => setShowObjectives(area.id)}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Ver Objetivos ({getCompletedObjectivesCount(area.id)}/5)
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalles */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const area = gameData.lifeAreas.find(a => a.id === selectedArea);
              const details = lifeAreaDetails[selectedArea];
              const level = getLevel(area.progress);
              
              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${details.color} flex items-center justify-center text-3xl`}>
                        {details.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{details.name}</h2>
                        <p className="text-gray-600">{details.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-gray-600">Nivel {level}</span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${details.color} text-white`}>
                            {details.milestones[level - 1].name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedArea(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Progreso Actual */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-800 font-medium">Progreso Actual</span>
                      <span className="text-2xl font-bold text-gray-800">{area.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                      <div 
                        className={`bg-gradient-to-r ${details.color} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-gray-600 text-sm">
                        XP ganados: {area.progress * 10}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Siguiente nivel: {level < 5 ? `${(level * 20) - area.progress}%` : 'Completado'}
                      </div>
                    </div>
                  </div>

                  {/* Controles de Progreso */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Ajustar Progreso</h3>
                    <div className="grid grid-cols-5 gap-2">
                      <button
                        onClick={() => handleProgressChange(selectedArea, -10)}
                        className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => handleProgressChange(selectedArea, -5)}
                        className="px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                      >
                        -5%
                      </button>
                      <button
                        onClick={() => handleProgressChange(selectedArea, -1)}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        -1%
                      </button>
                      <button
                        onClick={() => handleProgressChange(selectedArea, 1)}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        +1%
                      </button>
                      <button
                        onClick={() => handleProgressChange(selectedArea, 5)}
                        className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                      >
                        +5%
                      </button>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Milestones</h3>
                    <div className="space-y-3">
                      {details.milestones.map((milestone, index) => {
                        const isCompleted = index < level - 1;
                        const isCurrent = index === level - 1;
                        
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${
                              isCompleted 
                                ? 'bg-green-50 border-green-500' 
                                : isCurrent 
                                  ? 'bg-blue-50 border-blue-500' 
                                  : 'bg-gray-50 border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : isCurrent 
                                      ? 'bg-blue-500 text-white' 
                                      : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {isCompleted ? '✓' : index + 1}
                                </div>
                                <div>
                                  <h4 className={`font-medium text-sm ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Nivel {milestone.level}: {milestone.name}
                                  </h4>
                                  <p className={`text-xs ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {milestone.reward}
                                  </p>
                                </div>
                              </div>
                              <div className={`text-sm font-medium ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                                {milestone.xp} XP
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal de Milestones Simplificado */}
      {showMilestones && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-md">
            {(() => {
              const area = gameData.lifeAreas.find(a => a.id === showMilestones);
              const details = lifeAreaDetails[showMilestones];
              const level = getLevel(area.progress);
              
              return (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Milestones - {details.name}</h2>
                    <button
                      onClick={() => setShowMilestones(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {details.milestones.map((milestone, index) => {
                      const isCompleted = index < level - 1;
                      const isCurrent = index === level - 1;
                      
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            isCompleted 
                              ? 'bg-green-50 border-green-500' 
                              : isCurrent 
                                ? 'bg-blue-50 border-blue-500' 
                                : 'bg-gray-50 border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : isCurrent 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-300 text-gray-600'
                              }`}>
                                {isCompleted ? '✓' : index + 1}
                              </div>
                              <div>
                                <div className={`font-medium text-sm ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {milestone.name}
                                </div>
                                <div className={`text-xs ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                                  {milestone.reward}
                                </div>
                              </div>
                            </div>
                            <div className={`text-sm font-medium ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                              {milestone.xp} XP
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal de Objetivos */}
      {showObjectives && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const area = gameData.lifeAreas.find(a => a.id === showObjectives);
              const details = lifeAreaDetails[showObjectives];
              const objectives = getObjectivesForArea(showObjectives);
              
              return (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Objetivos - {details.name}</h2>
                    <button
                      onClick={() => setShowObjectives(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {objectives.map(objective => (
                      <div
                        key={objective.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          objective.completed 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => !objective.completed && updateObjectiveProgress(showObjectives, objective.id, 100)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                objective.completed 
                                  ? 'bg-green-500 border-green-500 cursor-default' 
                                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                              }`}
                              disabled={objective.completed}
                            >
                              {objective.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </button>
                            
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm mb-1 ${objective.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                {objective.title}
                              </h4>
                              <p className={`text-xs ${objective.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                {objective.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Edit and Delete Buttons */}
                          {!objective.completed && (
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={() => handleEditObjective(showObjectives, objective)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar objetivo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteObjective(showObjectives, objective)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar objetivo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Rewards Display */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              objective.completed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              +{objective.xp} XP
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              objective.completed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              +{objective.coins} coins
                            </div>
                          </div>
                          <div className={`text-xs font-medium ${objective.completed ? 'text-green-700' : 'text-gray-700'}`}>
                            {objective.completed ? 'Completado' : `${objective.progress}%`}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              objective.completed 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : 'bg-gradient-to-r from-blue-400 to-blue-600'
                            }`}
                            style={{ width: `${objective.completed ? 100 : objective.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-700">
                      <strong>Progreso:</strong> {getCompletedObjectivesCount(showObjectives)}/5 objetivos completados
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Completa objetivos para ganar XP, coins y avanzar en esta área de vida
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal para Editar Objetivo */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Objetivo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Título del Objetivo *
                </label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: Aprender inglés"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu objetivo..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Recompensa XP
                  </label>
                  <input
                    type="number"
                    value={newObjective.xp}
                    onChange={(e) => setNewObjective({...newObjective, xp: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    min="1"
                    max="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Recompensa Coins
                  </label>
                  <input
                    type="number"
                    value={newObjective.coins}
                    onChange={(e) => setNewObjective({...newObjective, coins: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    min="1"
                    max="500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingObjective(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateObjective}
                className="flex-1 btn-primary"
              >
                Actualizar Objetivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LifeAreas;
