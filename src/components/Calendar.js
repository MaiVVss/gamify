import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Target, Gift, Award, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

function Calendar({ addNotification }) {
  const { gameData, addCalendarEvent, removeCalendarEvent } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'goal',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '09:00',
    description: ''
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Obtener eventos del calendario y tareas con fecha
  const getEventsForDate = (date) => {
    const events = [];
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Eventos del calendario
    gameData.calendarEvents.forEach(event => {
      if (event.date === dateStr) {
        events.push({
          ...event,
          type: 'event'
        });
      }
    });
    
    // Tareas con fecha de vencimiento
    gameData.tasks.forEach(task => {
      if (task.dueDate === dateStr && !task.completed) {
        events.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          time: task.dueTime || '23:59',
          description: task.description || `Prioridad: ${task.priority}`,
          taskId: task.id
        });
      }
    });
    
    // Eventos simulados basados en el día
    const dayOfMonth = parseInt(format(date, 'd'));
    
    if (dayOfMonth % 5 === 0) {
      events.push({
        id: `goal-${dateStr}`,
        type: 'goal',
        title: 'Meta de productividad',
        time: '09:00',
        description: 'Completar 3 tareas importantes'
      });
    }
    
    if (dayOfMonth % 7 === 0) {
      events.push({
        id: `reward-${dateStr}`,
        type: 'reward',
        title: 'Día de recompensa',
        time: '18:00',
        description: 'Canjear una recompensa especial'
      });
    }
    
    return events.sort((a, b) => a.time.localeCompare(b.time));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({
      ...newEvent,
      date: format(date, 'yyyy-MM-dd')
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      addNotification('El título del evento es requerido', 'error');
      return;
    }

    const event = {
      ...newEvent,
      createdAt: new Date().toISOString()
    };

    addCalendarEvent(event);
    addNotification(`Evento "${event.title}" creado para ${format(new Date(event.date), 'dd/MM/yyyy')}`, 'success');

    setNewEvent({
      title: '',
      type: 'goal',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '09:00',
      description: ''
    });
    setShowModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    removeCalendarEvent(eventId);
    addNotification('Evento eliminado', 'success');
  };

  const handleTaskClick = (taskId) => {
    // Redirigir a la sección de tareas
    window.location.hash = '#tasks';
    addNotification('Navegando a la sección de tareas...', 'info');
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'goal': return <Target className="w-4 h-4 text-blue-600" />;
      case 'reward': return <Gift className="w-4 h-4 text-green-600" />;
      case 'event': return <CalendarIcon className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'goal': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'reward': return 'bg-green-100 border-green-300 text-green-700';
      case 'event': return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'task': return 'bg-orange-100 border-orange-300 text-orange-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getMonthStats = () => {
    let totalEvents = 0;
    let totalGoals = 0;
    let totalRewards = 0;
    let totalGeneral = 0;
    let totalTasks = 0;

    days.forEach(day => {
      if (isSameMonth(day, currentMonth)) {
        const events = getEventsForDate(day);
        totalEvents += events.length;
        totalGoals += events.filter(e => e.type === 'goal').length;
        totalRewards += events.filter(e => e.type === 'reward').length;
        totalGeneral += events.filter(e => e.type === 'event').length;
        totalTasks += events.filter(e => e.type === 'task').length;
      }
    });

    return { totalEvents, totalGoals, totalRewards, totalGeneral, totalTasks };
  };

  const stats = getMonthStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendario</h1>
          <p className="text-gray-600">Planifica tus metas y eventos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Evento
        </button>
      </div>

      {/* Estadísticas del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-glow p-4 text-center">
          <CalendarIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalEvents}</div>
          <div className="text-gray-600 text-sm">Total Eventos</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalGoals}</div>
          <div className="text-gray-600 text-sm">Metas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalRewards}</div>
          <div className="text-gray-600 text-sm">Recompensas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalGeneral}</div>
          <div className="text-gray-600 text-sm">Eventos</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalTasks}</div>
          <div className="text-gray-600 text-sm">Tareas</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="card-glow p-6">
            {/* Navegación del Mes */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-800">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h2>
              
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`relative p-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : isToday 
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : isCurrentMonth 
                            ? 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {format(day, 'd')}
                    </div>
                    
                    {/* Indicadores de eventos */}
                    <div className="flex justify-center gap-1 mt-1">
                      {events.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            event.type === 'goal' ? 'bg-blue-500' :
                            event.type === 'reward' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                        />
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-gray-500">+{events.length - 3}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalles del Día Seleccionado */}
        <div className="space-y-6">
          {/* Información del Día */}
          <div className="card-glow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {format(selectedDate, 'EEEE d MMMM', { locale: es })}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {isSameDay(selectedDate, new Date()) ? 'Hoy' : 
                   isSameDay(selectedDate, new Date(Date.now() + 86400000)) ? 'Mañana' :
                   format(selectedDate, 'EEEE', { locale: es })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-4 btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Evento
            </button>
          </div>

          {/* Eventos del Día */}
          <div className="card-glow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Eventos del Día</h3>
            
            <div className="space-y-3">
              {(() => {
                const dayEvents = getEventsForDate(selectedDate);
                
                if (dayEvents.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay eventos programados</p>
                    </div>
                  );
                }
                
                return dayEvents.map(event => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                    <div className="flex items-start gap-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm opacity-80">{event.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.type === 'task' && (
                          <button
                            onClick={() => handleTaskClick(event.taskId)}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Ver Tarea
                          </button>
                        )}
                        {(event.type === 'event' || event.type === 'goal' || event.type === 'reward') && (
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Leyenda */}
          <div className="card-glow p-4">
            <h4 className="font-medium text-gray-800 mb-3">Tipos de Eventos</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Metas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Recompensas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-600">Eventos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-600">Tareas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Nuevo Evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuevo Evento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ej: Revisión semanal"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tipo de Evento
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="goal">Meta</option>
                  <option value="reward">Recompensa</option>
                  <option value="event">Evento General</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Describe tu evento..."
                  rows={3}
                />
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
                onClick={handleAddEvent}
                className="flex-1 btn-primary"
              >
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
