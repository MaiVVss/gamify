import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, Trophy, Star, Flame, Zap } from 'lucide-react';

// All colors are defined as inline styles to be immune to dark mode CSS overrides
const typeConfig = {
  success: {
    icon: CheckCircle,
    iconColor: '#10b981',
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    border: '#6ee7b7',
    progressColor: '#10b981',
    textColor: '#065f46',
    subtitleColor: '#047857',
  },
  achievement: {
    icon: Trophy,
    iconColor: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    border: '#fcd34d',
    progressColor: '#f59e0b',
    textColor: '#78350f',
    subtitleColor: '#92400e',
  },
  levelup: {
    icon: Star,
    iconColor: '#8b5cf6',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    border: '#c4b5fd',
    progressColor: '#8b5cf6',
    textColor: '#3b0764',
    subtitleColor: '#4c1d95',
  },
  streak: {
    icon: Flame,
    iconColor: '#f97316',
    bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
    border: '#fdba74',
    progressColor: '#f97316',
    textColor: '#7c2d12',
    subtitleColor: '#9a3412',
  },
  xp: {
    icon: Zap,
    iconColor: '#3b82f6',
    bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    border: '#93c5fd',
    progressColor: '#3b82f6',
    textColor: '#1e3a8a',
    subtitleColor: '#1d4ed8',
  },
  error: {
    icon: XCircle,
    iconColor: '#ef4444',
    bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    border: '#fca5a5',
    progressColor: '#ef4444',
    textColor: '#7f1d1d',
    subtitleColor: '#991b1b',
  },
  warning: {
    icon: AlertCircle,
    iconColor: '#eab308',
    bg: 'linear-gradient(135deg, #fefce8, #fef9c3)',
    border: '#fde047',
    progressColor: '#eab308',
    textColor: '#713f12',
    subtitleColor: '#854d0e',
  },
  info: {
    icon: Info,
    iconColor: '#6366f1',
    bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    border: '#a5b4fc',
    progressColor: '#6366f1',
    textColor: '#312e81',
    subtitleColor: '#3730a3',
  },
};

function Toast({ notification, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = 5000;

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(notification.id), 350);
  };

  const type = notification.type || 'info';
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '1rem',
        minWidth: '300px',
        maxWidth: '380px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 10px -5px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
      }}
    >
      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 14px 10px' }}>
        <div style={{
          flexShrink: 0, width: 36, height: 36, borderRadius: 10,
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <Icon style={{ width: 18, height: 18, color: config.iconColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: config.textColor, lineHeight: 1.4 }}>
            {notification.message}
          </p>
          {notification.subtitle && (
            <p style={{ margin: '3px 0 0', fontSize: 11, color: config.subtitleColor }}>
              {notification.subtitle}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            flexShrink: 0, padding: 4, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.5)', color: config.textColor, marginTop: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.6, transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.4)', margin: '0 14px 12px', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: config.progressColor,
          borderRadius: 999,
          transition: 'width 0.05s linear',
        }} />
      </div>
    </div>
  );
}

function NotificationSystem({ notifications, onDismiss }) {
  const displayedNotifications = (notifications || []).slice(-3);

  return (
    <div
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none', maxHeight: 'calc(100vh - 2rem)',
      }}
    >
      {displayedNotifications.map(notification => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <Toast notification={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export default NotificationSystem;
