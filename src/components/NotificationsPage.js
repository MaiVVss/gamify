import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Bell, CheckCircle, XCircle, AlertCircle, Info, Trophy, Star, Flame, Zap,
  Trash2, CheckCheck, Filter, Clock
} from 'lucide-react';

const typeConfig = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Éxito' },
  achievement: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Logro' },
  levelup: { icon: Star, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Nivel' },
  streak: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', label: 'Racha' },
  xp: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', label: 'XP' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', label: 'Error' },
  warning: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100', label: 'Aviso' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Info' },
};

function formatRelativeTime(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Ahora mismo';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function NotificationsPage() {
  const { gameData, markNotificationsRead, clearNotificationHistory, themes } = useData();
  const [filter, setFilter] = useState('all');
  const [sortNewest, setSortNewest] = useState(true);

  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;

  const history = gameData.notificationHistory || [];

  // Mark all as read when page opens
  useEffect(() => {
    markNotificationsRead();
  }, []);

  const unreadCount = history.filter(n => !n.read).length;

  const filterOptions = [
    { id: 'all', label: 'Todas' },
    { id: 'achievement', label: 'Logros' },
    { id: 'levelup', label: 'Nivel' },
    { id: 'streak', label: 'Racha' },
    { id: 'success', label: 'Éxito' },
  ];

  const filtered = history
    .filter(n => filter === 'all' ? true : n.type === filter)
    .sort((a, b) => {
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      return sortNewest ? tb - ta : ta - tb;
    });

  const groupedByDate = filtered.reduce((groups, notification) => {
    const date = new Date(notification.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ayer';
    } else {
      groupKey = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      groupKey = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
    }

    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(notification);
    return groups;
  }, {});

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${themeConfig.text}`}>Notificaciones</h1>
            <p className={`text-sm ${themeConfig.textMuted}`}>
              {history.length === 0
                ? 'Sin notificaciones aún'
                : `${history.length} notificacion${history.length !== 1 ? 'es' : ''} en total`}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearNotificationHistory}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpiar todo</span>
          </button>
        )}
      </div>

      {/* Filters & Sort */}
      {history.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  filter === opt.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : `${themeConfig.card} ${themeConfig.textMuted} border-gray-200 hover:border-brand-200 hover:text-brand-600`
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortNewest(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${themeConfig.card} ${themeConfig.textMuted} border-gray-200 hover:border-brand-200`}
          >
            <Clock className="w-3.5 h-3.5" />
            {sortNewest ? 'Más recientes' : 'Más antiguas'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className={`${themeConfig.card} rounded-2xl border ${themeConfig.border} p-12 text-center`}>
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-brand-300" />
          </div>
          <h3 className={`font-semibold ${themeConfig.text} mb-1`}>Sin notificaciones</h3>
          <p className={`text-sm ${themeConfig.textMuted}`}>
            {filter === 'all'
              ? 'Completa tareas y hábitos para recibir notificaciones.'
              : 'No hay notificaciones de ese tipo todavía.'}
          </p>
        </div>
      )}

      {/* Notification List */}
      {Object.entries(groupedByDate).map(([dateLabel, notifications]) => (
        <div key={dateLabel} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textMuted}`}>
              {dateLabel}
            </span>
            <div className={`flex-1 h-px ${themeConfig.border} border-t`} />
          </div>

          <div className="flex flex-col gap-2">
            {notifications.map((notification) => {
              const type = notification.type || 'info';
              const config = typeConfig[type] || typeConfig.info;
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border ${config.border} ${config.bg} transition-all hover:shadow-sm group`}
                  style={{ background: undefined }} // let classname handle it
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-white/80">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug" style={{ color: '#1f2937' }}>{notification.message}</p>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-brand-500 rounded-full mt-1.5" />
                      )}
                    </div>
                    {notification.subtitle && (
                      <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{notification.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-white/70 border border-white/80 ${config.color} font-medium`}>
                        {config.label}
                      </span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>{formatRelativeTime(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationsPage;
