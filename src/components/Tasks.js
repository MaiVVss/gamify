import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { CheckSquare, Plus, Search, Calendar, AlertCircle, CheckCircle, Clock, Zap, Edit2, Trash2 } from 'lucide-react';

function Tasks({ addNotification }) {
  const { gameData, updateGameData, updateLifeAreaProgress, updateObjectiveProgress, themes } = useData();
  const { tasks } = gameData;
  
  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    xp: 10,
    startDate: '',
    endDate: '',
    hasDueDate: true,
    urgency: 'not_urgent', // urgent, not_urgent
    importance: 'important' // important, not_important
  });

  // Filtros
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro específico
    switch(filter) {
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.hasDueDate) return false;
          const today = new Date().toDateString();
          if (task.endDate) {
            return new Date(task.endDate).toDateString() === today;
          }
          if (task.dueDate) {
            return new Date(task.dueDate).toDateString() === today;
          }
          return false;
        });
        break;
      case 'week':
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        filtered = filtered.filter(task => {
          if (!task.hasDueDate) return false;
          if (task.endDate) {
            const taskDate = new Date(task.endDate);
            return taskDate >= new Date() && taskDate <= weekFromNow;
          }
          if (task.dueDate) {
            const taskDate = new Date(task.dueDate);
            return taskDate >= new Date() && taskDate <= weekFromNow;
          }
          return false;
        });
        break;
      case 'urgent':
        filtered = filtered.filter(task => task.urgency === 'urgent');
        break;
      case 'important':
        filtered = filtered.filter(task => task.importance === 'important');
        break;
      case 'urgent_important':
        filtered = filtered.filter(task => task.urgency === 'urgent' && task.importance === 'important');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => {
      // Siempre completadas al final
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'xp':
          return (b.xp || 0) - (a.xp || 0); // De mayor a menor
          
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
          
        case 'date': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case 'urgency':
        default: {
          const eisenhowerPriority = (task) => {
            if (task.urgency === 'urgent' && task.importance === 'important') return 0;
            if (task.urgency === 'urgent' && task.importance === 'not_important') return 1;
            if (task.urgency === 'not_urgent' && task.importance === 'important') return 2;
            return 3;
          };
          
          const priorityA = eisenhowerPriority(a);
          const priorityB = eisenhowerPriority(b);
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      }
    });
  }, [tasks, searchTerm, filter, sortBy]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      addNotification('El título de la tarea es requerido', 'error');
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      xp: newTask.xp,
      startDate: newTask.startDate || null,
      endDate: newTask.endDate || null,
      dueDate: (!newTask.hasDueDate) ? null : (newTask.endDate || newTask.dueDate || null),
      hasDueDate: newTask.hasDueDate,
      urgency: newTask.urgency,
      importance: newTask.importance,
      completed: false,
      createdAt: new Date().toISOString()
    };

    updateGameData({
      tasks: [...tasks, task]
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      xp: 10,
      startDate: '',
      endDate: '',
      hasDueDate: true,
      urgency: 'not_urgent',
      importance: 'important'
    });
    setShowModal(false);
    addNotification('Tarea creada exitosamente', 'success');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      xp: task.xp,
      startDate: task.startDate || '',
      endDate: task.endDate || task.dueDate || '',
      hasDueDate: task.hasDueDate !== false,
      urgency: task.urgency || 'not_urgent',
      importance: task.importance || 'important'
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim()) {
      addNotification('El título de la tarea es requerido', 'error');
      return;
    }

    const updatedTask = {
      ...editingTask,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      xp: newTask.xp,
      startDate: newTask.startDate || null,
      endDate: newTask.endDate || null,
      dueDate: (!newTask.hasDueDate) ? null : (newTask.endDate || newTask.dueDate || null),
      hasDueDate: newTask.hasDueDate,
      urgency: newTask.urgency,
      importance: newTask.importance
    };

    const updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t);
    updateGameData({ tasks: updatedTasks });

    addNotification(`Tarea "${updatedTask.title}" actualizada`, 'success');
    setShowEditModal(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      xp: 10,
      startDate: '',
      endDate: '',
      hasDueDate: true,
      urgency: 'not_urgent',
      importance: 'important'
    });
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      updateGameData({ tasks: updatedTasks });
      addNotification(`Tarea "${task.title}" eliminada`, 'success');
    }
  };

  const handleToggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleting = !task.completed;

    // Calcular recompensas (solo si completando)
    const xpBonus = task.priority === 'high' ? 20 : task.priority === 'medium' ? 10 : 5;
    const totalXP = isCompleting ? (task.xp || 0) + xpBonus : 0;
    const totalCoins = isCompleting ? Math.floor(totalXP / 2) : 0;

    // Actualizar la tarea con el estado y guardar/limpiar las recompensas ganadas
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : null,
          // Guardar las recompensas exactas para poder descontarlas si se desmarca
          earnedXP: isCompleting ? totalXP : 0,
          earnedCoins: isCompleting ? totalCoins : 0,
        };
      }
      return t;
    });

    // Actualizar tareas y usuario de forma atómica en un solo setGameData
    updateGameData(prev => ({
      ...prev,
      tasks: updatedTasks,
      user: {
        ...prev.user,
        // Si completando: sumar. Si desmarcando: descontar lo que se había ganado (task.earnedXP)
        xp: Math.max(0, (prev.user.xp || 0) + (isCompleting ? totalXP : -(task.earnedXP || 0))),
        coins: Math.max(0, (prev.user.coins || 0) + (isCompleting ? totalCoins : -(task.earnedCoins || 0))),
        totalTasksCompleted: Math.max(0, (prev.user.totalTasksCompleted || 0) + (isCompleting ? 1 : -1)),
      }
    }));

    if (isCompleting) {
      // Actualizar áreas de vida relacionadas
      const lifeAreaProgress = task.priority === 'high' ? 5 : task.priority === 'medium' ? 3 : 2;
      if (task.category) {
        updateLifeAreaProgress(task.category, lifeAreaProgress);
        const relatedObjectives = getRelatedObjectives(task.category, task.title);
        relatedObjectives.forEach(objectiveId => {
          updateObjectiveProgress(task.category, objectiveId, 10);
        });
      } else {
        updateLifeAreaProgress('personal', lifeAreaProgress);
      }
      addNotification(`¡Tarea completada! +${totalXP} XP +${totalCoins} coins`, 'success');
    } else {
      const deductedXP = task.earnedXP || 0;
      const deductedCoins = task.earnedCoins || 0;
      if (deductedXP > 0) {
        addNotification(`Tarea desmarcada. -${deductedXP} XP -${deductedCoins} coins`, 'warning');
      }
    }
  };

  // Función para obtener objetivos relacionados con una tarea
  const getRelatedObjectives = (areaId, taskTitle) => {
    const objectivesMap = {
      health: {
        'perder': 1, 'peso': 1, 'correr': 2, 'dormir': 3, 'agua': 4, 'meditar': 5,
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
        'tocar': 3, 'meditar': 4, 'crear': 5, 'arte': 5, 'creatividad': 5
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
    
    // Buscar palabras clave en el título de la tarea
    const title = taskTitle.toLowerCase();
    Object.entries(areaObjectives).forEach(([keyword, objectiveId]) => {
      if (title.includes(keyword)) {
        relatedIds.push(objectiveId);
      }
    });
    
    return relatedIds;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'border border-gray-100 bg-gray-50/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const getEisenhowerColor = (urgency, importance) => {
    if (urgency === 'urgent' && importance === 'important') return 'priority-high';
    if (urgency === 'urgent' && importance === 'not_important') return 'border border-orange-100 bg-orange-50/50';
    if (urgency === 'not_urgent' && importance === 'important') return 'border border-blue-100 bg-blue-50/50';
    return 'border border-gray-100 bg-gray-50/30';
  };

  const getEisenhowerLabel = (urgency, importance) => {
    if (urgency === 'urgent' && importance === 'important') return 'Hacer Ahora';
    if (urgency === 'urgent' && importance === 'not_important') return 'Delegar';
    if (urgency === 'not_urgent' && importance === 'important') return 'Planificar';
    return 'Eliminar/Aplazar';
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return 'Sin fecha límite';
    if (!startDate && endDate) return `Hasta ${new Date(endDate).toLocaleDateString('es-ES')}`;
    if (startDate && !endDate) return `Desde ${new Date(startDate).toLocaleDateString('es-ES')}`;
    return `${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    today: tasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate).toDateString() === new Date().toDateString();
    }).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  return (
    <div className={`space-y-6 ${themeConfig.text}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${themeConfig.text}`}>Tareas</h1>
          <p className={themeConfig.textMuted}>Gestiona tus misiones diarias y conquista tus objetivos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary hidden md:flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <div className={`card-glow p-3 flex flex-col items-center justify-center`}>
          <CheckSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mb-1" />
          <div className={`text-xl md:text-2xl font-bold ${themeConfig.text}`}>{stats.total}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider text-center`}>Totales</div>
        </div>
        
        <div className={`card-glow p-3 flex flex-col items-center justify-center`}>
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mb-1" />
          <div className={`text-xl md:text-2xl font-bold ${themeConfig.text}`}>{stats.completed}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider text-center`}>Completas</div>
        </div>
        
        <div className={`card-glow p-3 flex flex-col items-center justify-center`}>
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mb-1" />
          <div className={`text-xl md:text-2xl font-bold ${themeConfig.text}`}>{stats.today}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider text-center`}>Para Hoy</div>
        </div>
        
        <div className={`card-glow p-3 flex flex-col items-center justify-center`}>
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 mb-1" />
          <div className={`text-xl md:text-2xl font-bold ${themeConfig.text}`}>{stats.high}</div>
          <div className={`${themeConfig.textMuted} text-[10px] md:text-xs font-medium uppercase tracking-wider text-center`}>Urgentes</div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className={`card-glow p-4`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl ${themeConfig.text} placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all`}
            />
          </div>
          
          {/* Opción de Ordenar */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${themeConfig.textMuted} whitespace-nowrap`}>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2.5 border border-gray-200 rounded-xl text-sm ${themeConfig.text} focus:outline-none focus:border-brand-500 transition-all bg-transparent`}
            >
              <option value="urgency">Matriz Eisenhower</option>
              <option value="priority">Prioridad</option>
              <option value="newest">Más recientes</option>
              <option value="date">Fecha de vencimiento</option>
              <option value="xp">Premio XP</option>
            </select>
          </div>
        </div>
          
        {/* Stack de Filtros Deslizable en Celulares */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['all', 'today', 'week', 'urgent', 'important', 'urgent_important', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap flex-shrink-0 ${
                filter === f 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : `${themeConfig.bg} ${themeConfig.text} ${themeConfig.border} hover:bg-gray-100`
              }`}
            >
              {f === 'all' && 'Todas'}
              {f === 'today' && 'Hoy'}
              {f === 'week' && 'Esta Semana'}
              {f === 'urgent' && 'Urgentes'}
              {f === 'important' && 'Importantes'}
              {f === 'urgent_important' && 'Urg+Imp'}
              {f === 'completed' && 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl ${
                task.urgency && task.importance ? getEisenhowerColor(task.urgency, task.importance) : getPriorityColor(task.priority)
              } ${task.completed ? 'opacity-50 grayscale-[0.3]' : 'shadow-sm hover:shadow-md transition-shadow'}`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`mt-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg mb-1 leading-tight ${themeConfig.text} ${
                        task.completed ? 'line-through text-gray-500' : ''
                      } truncate`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mb-3 text-gray-500 ${
                          task.completed ? 'line-through' : ''
                        } line-clamp-2`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center flex-wrap gap-2 text-xs mt-3 pt-3 border-t border-gray-100/50">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-gray-600">
                          {getPriorityIcon(task.priority)}
                          <span className="capitalize">
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                        
                        {/* Eisenhower Matrix Display */}
                        {task.urgency && task.importance && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50/80 border text-purple-700 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                            {getEisenhowerLabel(task.urgency, task.importance)}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md text-blue-700 font-medium whitespace-nowrap">
                          <Zap className="w-3.5 h-3.5" />
                          {task.xp} XP
                        </div>
                        
                        {/* Date Range Display */}
                        <div className="flex items-center gap-1 bg-brand-50/50 px-2 py-1 rounded-md text-brand-700">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDateRange(task.startDate, task.endDate || task.dueDate)}</span>
                        </div>
                        
                        {task.completed && task.completedAt && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md text-green-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Completado {new Date(task.completedAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Edit and Delete Buttons */}
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Editar tarea"
                      >
                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckSquare className={`w-12 h-12 ${themeConfig.textMuted} mx-auto mb-4 opacity-50`} />
            <h3 className={`text-xl font-medium mb-2 ${themeConfig.text}`}>
              {searchTerm ? 'No se encontraron tareas' : 'No hay tareas aún'}
            </h3>
            <p className={`${themeConfig.textMuted} mb-4`}>
              {searchTerm ? 'Intenta con otra búsqueda' : 'Crea tu primera tarea para comenzar'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Tarea
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setShowModal(true)}
        className="md:hidden floating-button bottom-24"
        title="Crear Nueva Tarea"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal para Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${themeConfig.card} p-6 w-full max-w-md rounded-xl border ${themeConfig.border} max-h-[90vh] overflow-y-auto`}>
            <h2 className={`text-2xl font-bold mb-4 ${themeConfig.text}`}>Nueva Tarea</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                  Título *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="Nombre de la tarea"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none`}
                  placeholder="Describe tu tarea..."
                  rows={3}
                />
              </div>
              
              {/* Matriz de Eisenhower */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Urgencia
                  </label>
                  <select
                    value={newTask.urgency}
                    onChange={(e) => setNewTask({...newTask, urgency: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="not_urgent">No Urgente</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Importancia
                  </label>
                  <select
                    value={newTask.importance}
                    onChange={(e) => setNewTask({...newTask, importance: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="important">Importante</option>
                    <option value="not_important">No Importante</option>
                  </select>
                </div>
              </div>
              
              {/* Opciones de Fecha */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={newTask.hasDueDate}
                    onChange={(e) => setNewTask({...newTask, hasDueDate: e.target.checked})}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className={`text-sm font-medium ${themeConfig.text}`}>Tener fecha límite</span>
                </label>
                
                {newTask.hasDueDate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                        Fecha de inicio (opcional)
                      </label>
                      <input
                        type="date"
                        value={newTask.startDate}
                        onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                        className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                        Fecha de fin o vencimiento
                      </label>
                      <input
                        type="date"
                        value={newTask.endDate}
                        onChange={(e) => setNewTask({...newTask, endDate: e.target.value})}
                        className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                    Prioridad
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={newTask.xp}
                    onChange={(e) => setNewTask({...newTask, xp: parseInt(e.target.value) || 0})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                    min="1"
                    max="100"
                  />
                </div>
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
                onClick={handleAddTask}
                className="flex-1 btn-primary"
              >
                Crear Tarea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Tarea */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-glow p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Tarea</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Nombre de la tarea"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu tarea..."
                  rows={3}
                />
              </div>
              
              {/* Matriz de Eisenhower */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Urgencia
                  </label>
                  <select
                    value={newTask.urgency}
                    onChange={(e) => setNewTask({...newTask, urgency: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="not_urgent">No Urgente</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Importancia
                  </label>
                  <select
                    value={newTask.importance}
                    onChange={(e) => setNewTask({...newTask, importance: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="important">Importante</option>
                    <option value="not_important">No Importante</option>
                  </select>
                </div>
              </div>
              
              {/* Opciones de Fecha */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={newTask.hasDueDate}
                    onChange={(e) => setNewTask({...newTask, hasDueDate: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm font-medium ${themeConfig.text}`}>Tener fecha límite</span>
                </label>
                
                {newTask.hasDueDate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                        Fecha de inicio (opcional)
                      </label>
                      <input
                        type="date"
                        value={newTask.startDate}
                        onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                        className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                        Fecha de fin o vencimiento
                      </label>
                      <input
                        type="date"
                        value={newTask.endDate}
                        onChange={(e) => setNewTask({...newTask, endDate: e.target.value})}
                        className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                    Prioridad
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={newTask.xp}
                    onChange={(e) => setNewTask({...newTask, xp: parseInt(e.target.value) || 0})}
                    className={`w-full px-4 py-2 ${themeConfig.card} border ${themeConfig.border} rounded-lg ${themeConfig.text} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateTask}
                className="flex-1 btn-primary"
              >
                Actualizar Tarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
