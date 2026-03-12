import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Lightbulb,
  Zap,
  Award,
  BarChart3,
  Brain,
  Flag,
  Timer,
  Star,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';

// SMART Goal Templates
const goalTemplates = {
  health: [
    {
      title: 'Perder peso de forma saludable',
      description: 'Perder 5kg en 3 meses mediante ejercicio y alimentación balanceada',
      category: 'health',
      difficulty: 'medium',
      timeframe: '3 meses',
      milestones: ['Primer mes: -2kg', 'Segundo mes: -3.5kg', 'Tercer mes: -5kg']
    },
    {
      title: 'Correr mi primera maratón',
      description: 'Completar una maratón de 42km en 6 meses de entrenamiento',
      category: 'health',
      difficulty: 'hard',
      timeframe: '6 meses',
      milestones: ['10km en 2 meses', '21km en 4 meses', '42km en 6 meses']
    },
    {
      title: 'Mejorar calidad de sueño',
      description: 'Dormir 8 horas diarias durante 30 días consecutivos',
      category: 'health',
      difficulty: 'easy',
      timeframe: '1 mes',
      milestones: ['Semana 1: 6 horas promedio', 'Semana 2: 7 horas promedio', 'Semana 4: 8 horas promedio']
    }
  ],
  career: [
    {
      title: 'Obtener promoción laboral',
      description: 'Ser promovido a puesto senior en 12 meses mediante desempeño excepcional',
      category: 'career',
      difficulty: 'hard',
      timeframe: '12 meses',
      milestones: ['Primer trimestre: exceder metas', 'Segundo trimestre: liderar proyecto', 'Tercer trimestre: reconocimiento', 'Cuarto trimestre: promoción']
    },
    {
      title: 'Aprender nueva habilidad',
      description: 'Dominar Python y crear 3 proyectos en 4 meses',
      category: 'career',
      difficulty: 'medium',
      timeframe: '4 meses',
      milestones: ['Mes 1: Fundamentos', 'Mes 2: Proyectos simples', 'Mes 3: Proyectos intermedios', 'Mes 4: Proyectos avanzados']
    },
    {
      title: 'Certificación profesional',
      description: 'Obtener certificación PMP en 6 meses de estudio',
      category: 'career',
      difficulty: 'medium',
      timeframe: '6 meses',
      milestones: ['Mes 1-2: Fundamentos', 'Mes 3-4: Preparación', 'Mes 5: Práctica', 'Mes 6: Examen']
    }
  ],
  personal: [
    {
      title: 'Leer 24 libros al año',
      description: 'Leer 2 libros mensuales de diferentes géneros durante todo el año',
      category: 'personal',
      difficulty: 'medium',
      timeframe: '12 meses',
      milestones: ['Cada 2 libros: completar género', 'Cada 6 libros: reseña personal', 'Cada 12 libros: recomendar']
    },
    {
      title: 'Aprender a tocar guitarra',
      description: 'Tocar 5 canciones completas en 3 meses de práctica diaria',
      category: 'personal',
      difficulty: 'medium',
      timeframe: '3 meses',
      milestones: ['Mes 1: Cuerdas y acordes básicos', 'Mes 2: Primera canción simple', 'Mes 3: 5 canciones completas']
    },
    {
      title: 'Desarrollar rutina de meditación',
      description: 'Meditar 15 minutos diarios durante 60 días consecutivos',
      category: 'personal',
      difficulty: 'easy',
      timeframe: '2 meses',
      milestones: ['Semana 1: 5 minutos', 'Semana 2: 10 minutos', 'Semana 4: 15 minutos']
    }
  ],
  finances: [
    {
      title: 'Crear fondo de emergencia',
      description: 'Ahorrar 6 meses de gastos en 12 meses',
      category: 'finances',
      difficulty: 'hard',
      timeframe: '12 meses',
      milestones: ['Mes 3: 1.5 meses', 'Mes 6: 3 meses', 'Mes 9: 4.5 meses', 'Mes 12: 6 meses']
    },
    {
      title: 'Invertir en bolsa',
      description: 'Crear cartera de inversión diversificada de $5000 en 8 meses',
      category: 'finances',
      difficulty: 'medium',
      timeframe: '8 meses',
      milestones: ['Mes 2: Educación', 'Mes 4: Primeras inversiones', 'Mes 6: Diversificación', 'Mes 8: Meta alcanzada']
    },
    {
      title: 'Eliminar deudas de tarjetas',
      description: 'Pagar todas las deudas de tarjetas en 6 meses',
      category: 'finances',
      difficulty: 'medium',
      timeframe: '6 meses',
      milestones: ['Mes 2: Deuda más alta', 'Mes 4: 50% pagado', 'Mes 6: Deuda cero']
    }
  ]
};

function SmartGoals({ addNotification }) {
  const { gameData, updateGameData } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customGoal, setCustomGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    difficulty: 'medium',
    timeframe: '3 meses',
    milestones: [],
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: ''
  });

  // Smart goals from gameData
  const smartGoals = gameData.smartGoals || [];

  // Calculate SMART analysis
  const analyzeSMART = (goal) => {
    const analysis = {
      specific: 0,
      measurable: 0,
      achievable: 0,
      relevant: 0,
      timeBound: 0,
      overall: 0
    };

    // Specific analysis
    if (goal.title && goal.title.length > 5) analysis.specific += 25;
    if (goal.description && goal.description.includes('qué')) analysis.specific += 25;
    if (goal.category) analysis.specific += 25;
    if (goal.milestones && goal.milestones.length > 0) analysis.specific += 25;

    // Measurable analysis
    if (goal.description && /\d+/.test(goal.description)) analysis.measurable += 33;
    if (goal.milestones && goal.milestones.length > 1) analysis.measurable += 33;
    if (goal.difficulty) analysis.measurable += 34;

    // Achievable analysis
    if (goal.difficulty === 'easy' || goal.difficulty === 'medium') analysis.achievable += 50;
    if (goal.timeframe && goal.timeframe.includes('meses')) analysis.achievable += 50;

    // Relevant analysis
    if (goal.category) analysis.relevant += 50;
    if (goal.description && goal.description.length > 20) analysis.relevant += 50;

    // Time-bound analysis
    if (goal.timeframe) analysis.timeBound += 50;
    if (goal.milestones && goal.milestones.length > 0) analysis.timeBound += 50;

    analysis.overall = Math.round(
      (analysis.specific + analysis.measurable + analysis.achievable + analysis.relevant + analysis.timeBound) / 5
    );

    return analysis;
  };

  // Create custom SMART goal
  const handleCreateCustomGoal = () => {
    if (!customGoal.title.trim()) {
      addNotification('El título es requerido', 'error');
      return;
    }

    const newGoal = {
      id: Date.now(),
      ...customGoal,
      milestones: customGoal.milestones.filter(m => m.trim()),
      createdAt: new Date().toISOString(),
      progress: 0,
      completedMilestones: [],
      status: 'active'
    };

    const updatedGoals = [...smartGoals, newGoal];
    updateGameData({ smartGoals: updatedGoals });

    addNotification('Meta SMART creada exitosamente', 'success');
    setShowCreateModal(false);
    resetCustomGoal();
  };

  // Create goal from template
  const handleCreateFromTemplate = (template) => {
    const newGoal = {
      ...template,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0,
      completedMilestones: [],
      status: 'active'
    };

    const updatedGoals = [...smartGoals, newGoal];
    updateGameData({ smartGoals: updatedGoals });

    addNotification(`Meta "${template.title}" creada desde plantilla`, 'success');
    setSelectedTemplate(null);
  };

  // Update goal progress
  const handleUpdateProgress = (goalId, milestoneIndex) => {
    const updatedGoals = smartGoals.map(goal => {
      if (goal.id === goalId) {
        const completedMilestones = [...(goal.completedMilestones || []), milestoneIndex];
        const progress = Math.round((completedMilestones.length / goal.milestones.length) * 100);
        
        return {
          ...goal,
          completedMilestones,
          progress,
          status: progress === 100 ? 'completed' : 'active'
        };
      }
      return goal;
    });

    updateGameData({ smartGoals: updatedGoals });
    addNotification('Milestone completado', 'success');
  };

  // Delete goal
  const handleDeleteGoal = (goalId) => {
    const goal = smartGoals.find(g => g.id === goalId);
    if (window.confirm(`¿Eliminar la meta "${goal.title}"?`)) {
      const updatedGoals = smartGoals.filter(g => g.id !== goalId);
      updateGameData({ smartGoals: updatedGoals });
      addNotification('Meta eliminada', 'success');
    }
  };

  // Reset custom goal form
  const resetCustomGoal = () => {
    setCustomGoal({
      title: '',
      description: '',
      category: 'personal',
      difficulty: 'medium',
      timeframe: '3 meses',
      milestones: [],
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: ''
    });
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      health: '❤️',
      career: '💼',
      personal: '🧠',
      finances: '💰',
      relationships: '👥',
      home: '🏠'
    };
    return icons[category] || '🎯';
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'from-green-400 to-emerald-600',
      medium: 'from-yellow-400 to-amber-600',
      hard: 'from-red-400 to-rose-600'
    };
    return colors[difficulty] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Metas SMART</h1>
          <p className="text-gray-600">Define y alcanza objetivos específicos, medibles y alcanzables</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Meta SMART
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-glow p-4 text-center">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{smartGoals.length}</div>
          <div className="text-gray-600 text-sm">Metas Activas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {smartGoals.filter(g => g.status === 'completed').length}
          </div>
          <div className="text-gray-600 text-sm">Metas Completadas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {smartGoals.length > 0 ? Math.round(smartGoals.reduce((sum, g) => sum + g.progress, 0) / smartGoals.length) : 0}%
          </div>
          <div className="text-gray-600 text-sm">Progreso Promedio</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Brain className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {smartGoals.length > 0 ? Math.round(smartGoals.reduce((sum, g) => sum + analyzeSMART(g).overall, 0) / smartGoals.length) : 0}%
          </div>
          <div className="text-gray-600 text-sm">Score SMART</div>
        </div>
      </div>

      {/* Goal Templates */}
      <div className="card-glow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Plantillas de Metas SMART
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(goalTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>{getCategoryIcon(category)}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleCreateFromTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm">{template.title}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {template.timeframe}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Active Goals */}
      <div className="card-glow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5 text-blue-600" />
          Metas Activas
        </h2>
        
        {smartGoals.length > 0 ? (
          <div className="space-y-4">
            {smartGoals.map(goal => {
              const smartAnalysis = analyzeSMART(goal);
              const isCompleted = goal.status === 'completed';
              
              return (
                <div
                  key={goal.id}
                  className={`border rounded-xl p-4 transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center text-white">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className={`font-bold text-gray-800 mb-1 ${isCompleted ? 'line-through' : ''}`}>
                          {goal.title}
                        </h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getDifficultyColor(goal.difficulty)} text-white`}>
                        {goal.difficulty}
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso</span>
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* SMART Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Score SMART</span>
                      <span className={`text-sm font-bold ${
                        smartAnalysis.overall >= 80 ? 'text-green-600' :
                        smartAnalysis.overall >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {smartAnalysis.overall}%
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {Object.entries(smartAnalysis).filter(([key]) => key !== 'overall').map(([criterion, score]) => (
                        <div key={criterion} className="text-center">
                          <div className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-400' :
                            score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} style={{ width: '100%' }} />
                          <div className="text-xs text-gray-500 mt-1">{criterion[0].toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone, index) => {
                        const isCompleted = goal.completedMilestones?.includes(index);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded-lg border ${
                              isCompleted 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <button
                              onClick={() => !isCompleted && handleUpdateProgress(goal.id, index)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? 'bg-green-500 border-green-500 cursor-default' 
                                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                              }`}
                              disabled={isCompleted}
                            >
                              {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                            </button>
                            <span className={`text-sm ${isCompleted ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                              {milestone}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {goal.timeframe}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Creado: {new Date(goal.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay metas SMART activas</h3>
            <p className="text-gray-500 mb-4">Crea tu primera meta SMART usando las plantillas o el formulario personalizado</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Meta SMART
            </button>
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Meta SMART</h2>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Título de la Meta *
                  </label>
                  <input
                    type="text"
                    value={customGoal.title}
                    onChange={(e) => setCustomGoal({...customGoal, title: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Ej: Perder 10kg"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Categoría
                  </label>
                  <select
                    value={customGoal.category}
                    onChange={(e) => setCustomGoal({...customGoal, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="health">Salud</option>
                    <option value="career">Carrera</option>
                    <option value="personal">Personal</option>
                    <option value="finances">Finanzas</option>
                    <option value="relationships">Relaciones</option>
                    <option value="home">Hogar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Descripción *
                </label>
                <textarea
                  value={customGoal.description}
                  onChange={(e) => setCustomGoal({...customGoal, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu meta de forma específica y medible..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Dificultad
                  </label>
                  <select
                    value={customGoal.difficulty}
                    onChange={(e) => setCustomGoal({...customGoal, difficulty: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Plazo de Tiempo
                  </label>
                  <input
                    type="text"
                    value={customGoal.timeframe}
                    onChange={(e) => setCustomGoal({...customGoal, timeframe: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Ej: 3 meses"
                  />
                </div>
              </div>

              {/* SMART Framework */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Framework SMART
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-700 text-sm font-medium mb-1">
                      S - Específico
                    </label>
                    <textarea
                      value={customGoal.specific}
                      onChange={(e) => setCustomGoal({...customGoal, specific: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="¿Qué exactamente quieres lograr?"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blue-700 text-sm font-medium mb-1">
                      M - Medible
                    </label>
                    <textarea
                      value={customGoal.measurable}
                      onChange={(e) => setCustomGoal({...customGoal, measurable: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="¿Cómo medirás el éxito?"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blue-700 text-sm font-medium mb-1">
                      A - Alcanzable
                    </label>
                    <textarea
                      value={customGoal.achievable}
                      onChange={(e) => setCustomGoal({...customGoal, achievable: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="¿Es realista esta meta?"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blue-700 text-sm font-medium mb-1">
                      R - Relevante
                    </label>
                    <textarea
                      value={customGoal.relevant}
                      onChange={(e) => setCustomGoal({...customGoal, relevant: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="¿Por qué es importante para ti?"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-blue-700 text-sm font-medium mb-1">
                    T - Tiempo (Time-bound)
                  </label>
                  <textarea
                    value={customGoal.timeBound}
                    onChange={(e) => setCustomGoal({...customGoal, timeBound: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="¿Cuándo lograrás esta meta?"
                    rows={2}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Milestones (Pasos intermedios)
                </label>
                <div className="space-y-2">
                  {customGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => {
                          const updated = [...customGoal.milestones];
                          updated[index] = e.target.value;
                          setCustomGoal({...customGoal, milestones: updated});
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                        placeholder={`Paso ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const updated = customGoal.milestones.filter((_, i) => i !== index);
                          setCustomGoal({...customGoal, milestones: updated});
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setCustomGoal({...customGoal, milestones: [...customGoal.milestones, '']})}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
                  >
                    + Añadir Milestone
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCustomGoal();
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCustomGoal}
                className="flex-1 btn-primary"
              >
                Crear Meta SMART
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartGoals;
