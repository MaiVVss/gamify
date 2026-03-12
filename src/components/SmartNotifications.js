import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Bell, 
  BellRing, 
  Clock, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Star,
  Zap,
  Heart,
  Target,
  Award,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

// Notification templates
const notificationTemplates = {
  motivational: [
    "¡Sigue así! Cada pequeño paso te acerca a tus grandes metas 🚀",
    "Tu consistencia es tu superpoder. ¡Sigue adelante! 💪",
    "Hoy es un día perfecto para alcanzar nuevas metas ✨",
    "Tu futuro yo te agradece el esfuerzo de hoy 🌟",
    "El éxito es la suma de pequeñas acciones diarias 📈",
    "Cada tarea completada es una victoria que celebra 🎉",
    "Tu disciplina de hoy se convertirá en tu libertad de mañana 🦋",
    "Estás construyendo la versión más épica de ti mismo 🏆",
    "La perseverancia es el camino al éxito. ¡Tú puedes! 🛤️",
    "Tu potencial es ilimitado. ¡Sigue desbloqueándolo! 🔓"
  ],
  streak: [
    "🔥 ¡Llevas {streak} días de racha! No lo dejes escapar",
    "🔥 {streak} días seguidos... ¡Eres imparable!",
    "🔥 Tu racha de {streak} días está en llamas! ¡Mantén el fuego!",
    "🔥 {streak} días de consistencia... ¡Eres una leyenda!",
    "🔥 {streak} días y contando... ¡Tu disciplina es inspiradora!"
  ],
  productivity: [
    "📊 Tu productividad está en aumento. ¡Sigue así!",
    "📈 Has completado {tasks} tareas hoy. ¡Excelente rendimiento!",
    "⚡ Tu nivel de energía productiva es impresionante",
    "🎯 Estás superando tus metas diarias. ¡Sigue así!",
    "💪 Tu fuerza de voluntad está en su punto más alto"
  ],
  reminder: [
    "⏰ ¡No olvides tus hábitos de hoy!",
    "📝 Tienes tareas pendientes por completar",
    "🎯 Revisa tus metas SMART y avanza en tus milestones",
    "⚡ Un pequeño paso hoy, un gran salto mañana",
    "🌅 El día espera que escribas tu historia de éxito"
  ],
  celebration: [
    "🎉 ¡Felicidades! Has alcanzado un nuevo hito",
    "🏆 ¡Increíble! Has desbloqueado un nuevo logro",
    "⭐ ¡Brillante! Tu esfuerzo ha dado frutos",
    "🎊 ¡Celebración! Has superado tus propias expectativas",
    "🌟 ¡Épico! Has alcanzado la cima"
  ],
  insight: [
    "💡 Insight: Tu mejor momento de productividad es {bestTime}",
    "📊 Análisis: Tu área más fuerte es {strongestArea}",
    "🎯 Recomendación: Enfócate en {recommendation}",
    "📈 Tendencia: Has mejorado un {improvement}% esta semana",
    "🔍 Descubrimiento: Tu patrón de éxito es {pattern}"
  ]
};

// Smart notification triggers
const triggerConditions = {
  streakWarning: {
    condition: (gameData) => {
      const todayCompleted = gameData.tasks.some(t => 
        t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
      );
      return !todayCompleted && new Date().getHours() >= 20;
    },
    message: "⚠️ ¡Última oportunidad! Completa algo hoy para mantener tu racha 🔥",
    type: 'warning'
  },
  morningMotivation: {
    condition: (gameData) => {
      const hour = new Date().getHours();
      return hour >= 6 && hour <= 8;
    },
    message: () => notificationTemplates.motivational[Math.floor(Math.random() * notificationTemplates.motivational.length)],
    type: 'motivational'
  },
  productivityPeak: {
    condition: (gameData) => {
      const todayCompleted = gameData.tasks.filter(t => 
        t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
      ).length;
      return todayCompleted >= 5;
    },
    message: () => `🚀 ¡Productividad máxima! Has completado ${todayCompleted} tareas hoy`,
    type: 'celebration'
  },
  weeklyInsight: {
    condition: (gameData) => {
      const dayOfWeek = new Date().getDay();
      return dayOfWeek === 1; // Monday
    },
    message: (gameData) => {
      const lastWeekTasks = gameData.tasks.filter(t => {
        const taskDate = new Date(t.completedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return taskDate >= weekAgo;
      });
      return `📊 Semana pasada: Completaste ${lastWeekTasks.length} tareas. ¡ Nueva semana, nuevas oportunidades!`;
    },
    type: 'insight'
  },
  areaMilestone: {
    condition: (gameData) => {
      return gameData.lifeAreas.some(area => area.progress >= 50 && area.progress < 55);
    },
    message: () => {
      const area = gameData.lifeAreas.find(area => area.progress >= 50 && area.progress < 55);
      const areaNames = {
        health: 'Salud', career: 'Carrera', personal: 'Personal',
        finances: 'Finanzas', relationships: 'Relaciones', home: 'Hogar'
      };
      return `🎯 ¡Hit importante! Has alcanzado 50% en ${areaNames[area.id]}`;
    },
    type: 'celebration'
  }
};

function SmartNotifications({ addNotification }) {
  const { gameData } = useData();
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    motivational: true,
    streak: true,
    productivity: true,
    reminders: true,
    celebrations: true,
    insights: true,
    frequency: 'medium', // low, medium, high
    quietHours: { enabled: true, start: 22, end: 7 }
  });
  const [showSettings, setShowSettings] = useState(false);

  // Check if we're in quiet hours
  const isQuietHours = useMemo(() => {
    if (!settings.quietHours.enabled) return false;
    const currentHour = new Date().getHours();
    return currentHour >= settings.quietHours.start || currentHour < settings.quietHours.end;
  }, [settings.quietHours]);

  // Generate smart notifications
  const generateSmartNotification = useCallback(() => {
    if (!settings.enabled || isQuietHours) return null;

    // Check trigger conditions
    for (const [triggerId, trigger] of Object.entries(triggerConditions)) {
      if (trigger.condition(gameData)) {
        const message = typeof trigger.message === 'function' ? trigger.message(gameData) : trigger.message;
        
        return {
          id: Date.now(),
          type: trigger.type,
          message,
          timestamp: new Date(),
          triggerId,
          smart: true
        };
      }
    }

    // Generate contextual notifications based on frequency
    const shouldGenerate = Math.random() < getFrequencyProbability();
    if (!shouldGenerate) return null;

    const availableTypes = Object.keys(notificationTemplates).filter(type => settings[type]);
    if (availableTypes.length === 0) return null;

    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const templateList = notificationTemplates[selectedType];
    const message = templateList[Math.floor(Math.random() * templateList.length)];

    return {
      id: Date.now(),
      type: selectedType,
      message,
      timestamp: new Date(),
      smart: true
    };
  }, [gameData, settings, isQuietHours]);

  // Get notification frequency probability
  const getFrequencyProbability = () => {
    const frequencies = {
      low: 0.1,
      medium: 0.2,
      high: 0.3
    };
    return frequencies[settings.frequency] || 0.2;
  };

  // Check and generate notifications
  useEffect(() => {
    const notification = generateSmartNotification();
    if (notification) {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    }
  }, [generateSmartNotification]);

  // Periodic notification check
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      const notification = generateSmartNotification();
      if (notification) {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      }
    }, getNotificationInterval());

    return () => clearInterval(interval);
  }, [settings.enabled, generateSmartNotification]);

  // Get notification interval based on frequency
  const getNotificationInterval = () => {
    const intervals = {
      low: 60 * 60 * 1000,    // 1 hour
      medium: 30 * 60 * 1000,  // 30 minutes
      high: 15 * 60 * 1000     // 15 minutes
    };
    return intervals[settings.frequency] || 30 * 60 * 1000;
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    const icons = {
      motivational: Star,
      streak: Zap,
      productivity: TrendingUp,
      reminder: Clock,
      celebration: Award,
      insight: Target,
      warning: AlertCircle
    };
    return icons[type] || Bell;
  };

  // Get notification color
  const getNotificationColor = (type) => {
    const colors = {
      motivational: 'text-yellow-600',
      streak: 'text-orange-600',
      productivity: 'text-green-600',
      reminder: 'text-blue-600',
      celebration: 'text-purple-600',
      insight: 'text-indigo-600',
      warning: 'text-red-600'
    };
    return colors[type] || 'text-gray-600';
  };

  // Clear notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Notificaciones Inteligentes</h1>
          <p className="text-gray-600">Mensajes contextuales y motivación personalizada</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-glow p-4 text-center">
          <Bell className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{notifications.length}</div>
          <div className="text-gray-600 text-sm">Notificaciones Activas</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{gameData.user.streak}</div>
          <div className="text-gray-600 text-sm">Días de Racha</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {settings.enabled ? 'Activo' : 'Inactivo'}
          </div>
          <div className="text-gray-600 text-sm">Sistema</div>
        </div>
        
        <div className="card-glow p-4 text-center">
          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {isQuietHours ? 'Silencio' : 'Activo'}
          </div>
          <div className="text-gray-600 text-sm">Modo Actual</div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card-glow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            Notificaciones Recientes
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Limpiar todas
            </button>
          )}
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          notification.type === 'warning' ? 'bg-red-100 text-red-700' :
                          notification.type === 'celebration' ? 'bg-purple-100 text-purple-700' :
                          notification.type === 'insight' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {notification.smart ? 'Smart' : 'System'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">{notification.message}</p>
                    </div>
                    
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay notificaciones</h3>
            <p className="text-gray-500">
              {settings.enabled 
                ? 'Las notificaciones inteligentes aparecerán aquí'
                : 'Activa las notificaciones para recibir mensajes personalizados'
              }
            </p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-glow p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Configuración de Notificaciones</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Notificaciones Inteligentes</label>
                <button
                  onClick={() => setSettings({...settings, enabled: !settings.enabled})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tipos de Notificaciones</h3>
                <div className="space-y-2">
                  {Object.entries(notificationTemplates).map(([type, templates]) => (
                    <div key={type} className="flex items-center justify-between">
                      <label className="text-gray-600 text-sm capitalize">
                        {type === 'motivational' ? 'Motivacionales' :
                         type === 'streak' ? 'Rachas' :
                         type === 'productivity' ? 'Productividad' :
                         type === 'reminder' ? 'Recordatorios' :
                         type === 'celebration' ? 'Celebraciones' :
                         type === 'insight' ? 'Insights' : type}
                      </label>
                      <button
                        onClick={() => setSettings({...settings, [type]: !settings[type]})}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          settings[type] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settings[type] ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Frecuencia</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setSettings({...settings, frequency: freq})}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        settings.frequency === freq
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {freq === 'low' ? 'Baja' : freq === 'medium' ? 'Media' : 'Alta'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Horas Silencio</h3>
                  <button
                    onClick={() => setSettings({
                      ...settings, 
                      quietHours: {...settings.quietHours, enabled: !settings.quietHours.enabled}
                    })}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      settings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.quietHours.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Desde</label>
                      <select
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings({
                          ...settings, 
                          quietHours: {...settings.quietHours, start: parseInt(e.target.value)}
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Hasta</label>
                      <select
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings({
                          ...settings, 
                          quietHours: {...settings.quietHours, end: parseInt(e.target.value)}
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartNotifications;
